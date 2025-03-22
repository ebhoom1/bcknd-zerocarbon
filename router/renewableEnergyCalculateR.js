const express = require("express");
const RenewableEnergyCalculateController = require("../controllers/renewableEnergyCalculate");

const router = express.Router();

// POST: Analyse decarbonization roadmap
router.post("/calculate",RenewableEnergyCalculateController.calculateRenewableEnergyImpact);
router.post("/save", RenewableEnergyCalculateController.saveCalculation);
router.get("/get/:userId", RenewableEnergyCalculateController.getUserCalculations);

module.exports = router;