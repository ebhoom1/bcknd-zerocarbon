const mongoose = require("mongoose");

const MobileCombustionSchema = new mongoose.Schema({
  vehicleType: { type: String },
  fuelType: { type: String },
  NCV: { type: Number }, // Net Calorific Value (MJ/kg)
  CO2: { type: Number }, // CO2 emissions (kg/T)
  CH4: { type: Number }, // CH4 emissions (kg/T)
  N2O: { type: Number }, // N2O emissions (kg/T)
  CO2e: { type: Number }, // CO2 equivalent emissions (kg/T)
  unit: { type: String },
  source: { type: String },
  reference: { type: String },
});

module.exports = mongoose.model("MobileCombustion", MobileCombustionSchema);
