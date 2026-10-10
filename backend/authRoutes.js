
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// IMPORTANT: use "./user" if your file is named user.js.
// If your file is named User.js, change this to require("./User").
const User = require("./user");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createAuthToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function createMailer() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("Email settings are missing from backend/.env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

// 1. SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !isValidEmail(email)) {
      return res.status(400).json({
        message: "Enter your name and a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "This email already has an account. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      token: createAuthToken(user),
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email already has an account. Please log in.",
      });
    }

    console.error("Signup error:", error.message);
    return res.status(500).json({
      message: "Could not create your account.",
    });
  }
});

// 2. LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Incorrect email or password.",
      });
    }

    return res.json({
      message: "Login successful!",
      token: createAuthToken(user),
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Could not log in.",
    });
  }
});

// 3. FORGOT PASSWORD — EMAIL A RESET LINK
router.post("/forgot-password", async (req, res) => {
  const safeMessage =
    "If an account exists for this email, a password-reset link will be sent.";

  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(200).json({ message: safeMessage });
    }

    const user = await User.findOne({ email });

    // Do not reveal whether an email is registered.
    if (!user) {
      return res.status(200).json({ message: safeMessage });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink =
      `${frontendUrl}/?resetToken=${rawToken}` +
      `&email=${encodeURIComponent(user.email)}`;

    try {
      const mailer = createMailer();

      await mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your MovieBook password",
        text:
          `Hello ${user.name},\n\n` +
          "Use the link below to create a new password. " +
          "It expires in 15 minutes and can be used only once:\n\n" +
          `${resetLink}\n\n` +
          "If you did not request this, ignore this email.",
      });
    } catch (mailError) {
      user.resetTokenHash = null;
      user.resetTokenExpiry = null;
      await user.save();

      console.error("Email sending error:", mailError.message);

      return res.status(503).json({
        message: "The reset email could not be sent. Check your email settings.",
      });
    }

    return res.json({ message: safeMessage });
  } catch (error) {
    console.error("Forgot-password error:", error.message);
    return res.status(500).json({
      message: "Could not process your request.",
    });
  }
});

// 4. RESET PASSWORD — VALIDATE THE LINK AND SAVE THE NEW PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const token = String(req.body.token || "");
    const password = String(req.body.password || "");

    if (!isValidEmail(email) || !token || password.length < 8) {
      return res.status(400).json({
        message: "Enter a valid reset link and a password of at least 8 characters.",
      });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email,
      resetTokenHash: tokenHash,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "The reset link is invalid or expired. Request a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetTokenHash = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.json({
      message: "Password changed successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset-password error:", error.message);
    return res.status(500).json({
      message: "Could not reset your password.",
    });
  }
});

module.exports = router;