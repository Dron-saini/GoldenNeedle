const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: true,
    unique: true,
  },

  pwd: {
    type: String,   // still plain text (we will improve later)
    required: true,
  },

  usertype: {
    type: String,
    enum: ["tailor", "customer"],
    required: true,
  },

  // 🔽 ADD THESE FOR OTP
  otp: {
    type: String,
  },

  otpExpiry: {
    type: Date,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
