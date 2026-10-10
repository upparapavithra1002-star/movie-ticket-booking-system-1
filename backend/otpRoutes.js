
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      {
        mobile: {
          type: String,
          required: true,
          unique: true,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
      { timestamps: true }
    )
  );

function normalizeIndianMobile(value) {
  const digits = String(value || "").replace(/\D/g, "");

  if (/^[6-9]\d{9}$/.test(digits)) return "91" + digits;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;

  return null;
}

function settingsPresent() {
  return (
    process.env.MSG91_AUTH_KEY &&
    process.env.MSG91_TEMPLATE_ID &&
    process.env.JWT_SECRET
  );
}

// Send a real OTP by SMS through MSG91
router.post("/send-otp", async (req, res) => {
  try {
    if (!settingsPresent()) {
      return res.status(500).json({
        message: "MSG91 settings are missing from backend/.env",
      });
    }

    const mobile = normalizeIndianMobile(req.body.mobile);

    if (!mobile) {
      return res.status(400).json({
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.searchParams.set("template_id", process.env.MSG91_TEMPLATE_ID);
    url.searchParams.set("mobile", mobile);
    url.searchParams.set("authkey", process.env.MSG91_AUTH_KEY);
    url.searchParams.set("otp_length", "6");
    url.searchParams.set("otp_expiry", "5");

    const response = await fetch(url, { method: "POST" });
    const data = await response.json();

    if (!response.ok || data.type === "error") {
      console.error("MSG91 send OTP failed:", data);
      return res.status(502).json({
        message: "MSG91 could not send the OTP. Check your account and template.",
      });
    }

    return res.json({
      message: "OTP request sent. Check your mobile phone.",
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    return res.status(500).json({
      message: "Unable to send OTP right now.",
    });
  }
});

// Verify OTP, then create/find the user and issue a login token
router.post("/verify-otp", async (req, res) => {
  try {
    if (!settingsPresent()) {
      return res.status(500).json({
        message: "MSG91 settings are missing from backend/.env",
      });
    }

    const mobile = normalizeIndianMobile(req.body.mobile);
    const otp = String(req.body.otp || "").trim();

    if (!mobile || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter a valid mobile number and 6-digit OTP.",
      });
    }

    const url = new URL("https://control.msg91.com/api/v5/otp/verify");
    url.searchParams.set("mobile", mobile);
    url.searchParams.set("otp", otp);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
      },
    });

    const data = await response.json();

    if (
      !response.ok ||
      data.type === "error" ||
      !String(data.message || "").toLowerCase().includes("verified")
    ) {
      return res.status(401).json({
        message: "OTP is incorrect or expired. Please try again.",
      });
    }

    const user = await User.findOneAndUpdate(
      { mobile },
      { $set: { verified: true } },
      { new: true, upsert: true, runValidators: true }
    );

    const token = jwt.sign(
      { userId: user._id.toString(), mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Mobile number verified successfully!",
      token,
      user: {
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res.status(500).json({
      message: "Unable to verify OTP right now.",
    });
  }
});

module.exports = router;