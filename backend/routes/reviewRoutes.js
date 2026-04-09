const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Tailor = require("../models/Tailor");


// -----------------------------
 // POST: Save review
// -----------------------------
router.post("/review", async (req, res) => {
  try {
    const { mobile, star, review } = req.body;

    const newReview = new Review({
      mobile,
      star,
      review
    });

    await newReview.save();

    res.json({ message: "Review saved successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});


// -----------------------------
 // GET: Find tailor by mobile
// -----------------------------
router.get("/tailor/find-by-mobile/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;

    const tailor = await Tailor.findOne({ contact: mobile });

    if (!tailor) {
      return res.status(404).json({ msg: "Tailor not found" });
    }

    // 🔥 Calculate average rating
    const reviews = await Review.find({ mobile });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.star, 0) / reviews.length
        : 0;

    res.json({
      name: tailor.name,
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;