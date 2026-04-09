const express = require("express");
const CustomerProfile = require("../models/CustomerProfile");
const upload = require("../config/multer");

const router = express.Router();
console.log("CustomerProfile routes loaded");

/* SEARCH */
router.post("/find", async (req, res) => {
  const { emailid } = req.body;
  const doc = await CustomerProfile.findOne({ emailid });
  if (!doc) return res.status(404).json({ msg: "Profile not found" });
  res.json(doc);
});

/* SAVE with IMAGE */
router.post("/save", upload.single("profilepic"), async (req, res) => {
  console.log("SAVE ROUTE HIT");
  try {
    const data = {
      ...req.body,
      profilepic: req.file?.path, // Cloudinary URL
    };

    const profile = new CustomerProfile(data);
    await profile.save();

    res.json({ msg: "Profile saved", profile });
  } catch (err) {
    res.status(500).json({ msg: "Save failed", err });
  }
});

/* UPDATE with IMAGE */
router.post("/update", upload.single("profilepic"), async (req, res) => {
  const { emailid } = req.body;

  const updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.profilepic = req.file.path;
  }

  await CustomerProfile.updateOne({ emailid }, updateData);
  res.json({ msg: "Profile updated" });
});

module.exports = router;
