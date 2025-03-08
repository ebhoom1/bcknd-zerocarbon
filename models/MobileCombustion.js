const mongoose = require("mongoose");

const MobileCombustionSchema = new mongoose.Schema({
  vehicleType: { type: String },
  fuelType: { type: String },
  NCV: { type: String }, // Net Calorific Value (MJ/kg)
  CO2: { type: String }, // CO2 emissions (kg/T)
  CH4: { type: String }, // CH4 emissions (kg/T)
  N2O: { type: String }, // N2O emissions (kg/T)
  CO2e: { type: String }, // CO2 equivalent emissions (kg/T)
  unit: { type: String },
  source: { type: String },
  reference: { type: String },
});

module.exports = mongoose.model("MobileCombustion", MobileCombustionSchema);
