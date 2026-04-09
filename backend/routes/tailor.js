const express = require("express");
const router = express.Router();
const Tailor = require("../models/Tailor");
const Tesseract = require("tesseract.js");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tailor_profiles",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// SAVE OR UPDATE
router.post(
  "/save",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { emailid } = req.body;

      if (!emailid) {
        return res.status(400).json({ msg: "Email is required" });
      }

      let existing = await Tailor.findOne({ emailid });

      const updatedData = { ...req.body };

      // ✅ SAFE PARSE FUNCTION
      const safeParse = (val) => {
        if (!val) return [];

        // already array
        if (Array.isArray(val)) return val;

        try {
          return JSON.parse(val);
        } catch (err) {
          console.log("Parse error:", val);
          return [];
        }
      };

      // ✅ FIX ARRAY FIELDS
      updatedData.category = safeParse(updatedData.category);
      updatedData.speciality = safeParse(updatedData.speciality);

      // ✅ HANDLE FILE UPLOADS SAFELY
      if (req.files?.profileImage) {
        updatedData.profileImage = req.files.profileImage[0].path;
      }

      if (req.files?.aadharImage) {
        updatedData.aadharImage = req.files.aadharImage[0].path;
      }

      // 🔍 DEBUG LOG (VERY IMPORTANT)
      console.log("FINAL DATA:", updatedData);

      if (existing) {
        await Tailor.updateOne({ emailid }, updatedData);
        return res.json({ msg: "Profile updated" });
      } else {
        const newProfile = new Tailor(updatedData);
        await newProfile.save();
        return res.json({ msg: "Profile created" });
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);
// FIND TAILOR BY MOBILE
router.get("/find-by-mobile/:mobile", async (req, res) => {
  try {
    const tailor = await Tailor.findOne({
      contact: req.params.mobile,
    });

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    res.json(tailor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OCR AADHAAR ROUTE
router.post("/ocr-aadhar", upload.single("aadharImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    const imageUrl = req.file.path; // Cloudinary URL

    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => console.log(m),
    });

    const text = result.data.text;

    // Extract Aadhaar Number (12 digits)
    const aadharMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}/);

    // Extract possible name (simple heuristic)
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    let possibleName = "";

    // Method 1: Try finding name above DOB
    const dobIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("dob"),
    );

    if (dobIndex > 0) {
      possibleName = lines[dobIndex - 1].trim();
    }

    // Fallback method
    if (!possibleName) {
      for (let line of lines) {
        const cleanLine = line.trim();

        if (
          cleanLine.length < 4 ||
          cleanLine.match(/\d/) ||
          cleanLine.toLowerCase().includes("government") ||
          cleanLine.toLowerCase().includes("india") ||
          cleanLine.toLowerCase().includes("male") ||
          cleanLine.toLowerCase().includes("female") ||
          cleanLine.toLowerCase().includes("dob")
        )
          continue;

        if (/^[A-Za-z\s]+$/.test(cleanLine)) {
          possibleName = cleanLine;
          break;
        }
      }
    }

    res.json({
      name: possibleName || "",
      aadharNo: aadharMatch ? aadharMatch[0].replace(/\s/g, "") : "",
      rawText: text,
    });
  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({ msg: "OCR Failed" });
  }
});



//FILTER TAILORS
router.get("/find-tailors", async (req, res) => {
  try {
    const { city, category, speciality } = req.query;

    let query = {};

    const normalize = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return [val];
    };

    const catArray = normalize(category);
    const specArray = normalize(speciality);

    // ✅ City (exact match)
    if (city) {
      query.city = city;
    }

    // ✅ Category (must match ALL selected)
    if (catArray.length) {
      query.category = { $all: catArray };
    }

    // ✅ Speciality (must match ALL selected)
    if (specArray.length) {
      query.speciality = { $all: specArray };
    }

    console.log("FINAL QUERY:", query);

    const tailors = await Tailor.find(query);

    res.json(tailors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching tailors" });
  }
});

// GET ALL UNIQUE CITIES
router.get("/tailor-filters", async (req, res) => {
  try {
    const tailors = await Tailor.find({}, "city");

    const cities = tailors
      .map((t) => t.city)
      .filter((c) => c && c.trim() !== "");

    const uniqueCities = [...new Set(cities)];

    res.json({ cities: uniqueCities });
  } catch (err) {
    console.error("FILTER ERROR:", err);
    res.status(500).json({ msg: "Error fetching cities" });
  }
});

// GET PROFILE
// router.get("/:emailid", async (req, res) => {
//   try {
//     const profile = await Tailor.findOne({
//       emailid: req.params.emailid,
//     });
//     res.json(profile);
//   } catch {
//     res.status(500).json({ msg: "Error" });
//   }
// });
router.get("/profile/:emailid", async (req, res) => {
  try {
    const profile = await Tailor.findOne({
      emailid: req.params.emailid,
    });
    res.json(profile);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
});


// ✅ GET SINGLE TAILOR BY ID

router.get("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const tailor = await Tailor.findOne({ _id: id });

    console.log("FOUND:", tailor); // debug

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    res.json(tailor);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
