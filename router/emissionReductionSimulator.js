const express = require("express");
const EmissionReductionSimulatorController = require("../controllers/EmissionsReductionSimulator");

const router = express.Router();

// POST: Analyse decarbonization roadmap
router.post("/simulate",EmissionReductionSimulatorController.calculateEmissionsReduction);
router.post("/save", EmissionReductionSimulatorController.saveSimulation);
router.get("/get/:userId", EmissionReductionSimulatorController.getSimulationsByUser);


module.exports = router;