const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendOTP = require("../config/mailer");



console.log("user.js routes loaded");
router.post("/signup", async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const { emailid, pwd, usertype } = req.body;

    // 1️⃣ Check if user already exists
    const existing = await User.findOne({ emailid });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ Create user with OTP fields
    const user = new User({
      emailid,
      pwd,
      usertype,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
      isVerified: false,
    });

    await user.save();

    // 4️⃣ Send OTP email
    await sendOTP(emailid, otp);

    res.json({ msg: "Signup successful. OTP sent to email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", err });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const { emailid, otp } = req.body;

    const user = await User.findOne({ emailid });

    if (!user)
      return res.status(400).json({ msg: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (user.otpExpiry < new Date())
      return res.status(400).json({ msg: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ msg: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});


// LOGIN ROUTE
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  try {
    const { emailid, pwd } = req.body;

    // 1️⃣ Validate input
    if (!emailid || !pwd) {
      return res.status(400).json({ msg: "Missing credentials" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ emailid });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Check password
    if (user.pwd !== pwd) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 4️⃣ Check if email verified
    if (!user.isVerified) {
      return res.status(403).json({
        msg: "Please verify your email before login",
      });
    }

    // 5️⃣ Login success
    res.json({
      msg: "Login successful",
      emailid: user.emailid,
      usertype: user.usertype,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
