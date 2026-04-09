const mongoose = require("mongoose");

const tailorSchema = new mongoose.Schema(
  {
    emailid: { type: String, required: true, unique: true },

    name: String,
    contact: String,
    address: String,
    city: String,
    aadharNo: String,

    category: [String],
    speciality: [String],
    website: String,
    since: String,
    workType: String,
    shopAddress: String,
    shopCity: String,

    otherInfo: String,

    profileImage: String,
    aadharImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tailor", tailorSchema);

