const express = require("express");
const EmissionReductionSimulatorController = require("../controllers/EmissionsReductionSimulator");

const router = express.Router();

// POST: Analyse decarbonization roadmap
router.post("/simulate",EmissionReductionSimulatorController.calculateEmissionsReduction);

module.exports = router;