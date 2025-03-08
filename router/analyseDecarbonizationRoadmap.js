const express = require("express");
const AnalyseRoadmapController = require("../controllers/AnalyseRoadmapController");

const router = express.Router();

// POST: Analyse decarbonization roadmap
router.post("/calculate",AnalyseRoadmapController.calculateRoadmap);
router.post("/save",AnalyseRoadmapController.saveRoadmap);
router.get("/get/:userId",AnalyseRoadmapController.getSavedRoadmaps);

module.exports = router;