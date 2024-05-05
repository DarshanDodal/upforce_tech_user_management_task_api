const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename to include a timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_UPLOAD_SIZE, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "INVALID_FILE_TYPE";
      error.message = "Incorrect file. Please use .jpeg or .png files.";
      return cb(error, false);
    }

    cb(null, true);
  },
});

module.exports = upload;
