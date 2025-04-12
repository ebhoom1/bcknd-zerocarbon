const fs = require("fs");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const governanceController = require("../../controllers/submission/governanceUploadSecController");

// Create folder if not exists
const uploadDir = path.join(__dirname, "../../uploads/governance");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // recursive = creates parent dirs if needed
}

// Storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // now guaranteed to exist
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post(
  "/governance/submit",
  upload.any(),
  governanceController.submitGovernanceForm
);

module.exports = router;
