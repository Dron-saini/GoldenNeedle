const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tailor_customer_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = multer({ storage });
