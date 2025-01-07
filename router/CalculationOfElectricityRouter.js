const express = require('express');
const router = express.Router();
const electricityController = require('../controllers/CalculationOfElectricityController');

// Calculate and save electricity emissions
router.post('/calculate-electricity-emission', electricityController.calculateAndSaveElectricityEmission);

module.exports = router;
