const express = require("express");
const router = express.Router();
const griController = require("../../controllers/GRIcontroller/griController");

// Save or update GRI responses
router.post("/gri/save", griController.saveGRIResponses);

// Get GRI responses by user ID
router.get("/gri/:userId", griController.getGRIResponses);

module.exports = router;
