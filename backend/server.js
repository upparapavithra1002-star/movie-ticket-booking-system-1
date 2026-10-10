const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const otpRoutes = require("./otpRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", otpRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Movie Ticket Booking API is running!");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });