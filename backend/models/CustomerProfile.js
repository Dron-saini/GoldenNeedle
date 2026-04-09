const mongoose = require("mongoose");

const customerProfileSchema = new mongoose.Schema({
  emailid: { type: String, required: true, unique: true },
  name: String,
  address: String,
  city: String,
  state: String,
  gender: String,
  profilepic: String, // image filename / url
});

module.exports = mongoose.model("CustomerProfile", customerProfileSchema);
