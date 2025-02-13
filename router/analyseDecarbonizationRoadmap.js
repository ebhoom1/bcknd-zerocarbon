const express = require("express");
const AnalyseRoadmapController = require("../controllers/AnalyseRoadmapController");

const router = express.Router();

// POST: Analyse decarbonization roadmap
router.post("/calculate",AnalyseRoadmapController.calculateRoadmap);

module.exports = router;