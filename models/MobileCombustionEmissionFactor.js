const mongoose = require("mongoose");

const MobileCombustionSchema = new mongoose.Schema({
  sourceOfEmission: { type: String, required: true },  // e.g. Diesel Engine
  ghgActivity: { type: String, required: true },        // e.g. BS 4 Diesel
  units: { type: String, required: true },               // e.g. Litre
  emissionFactor: { type: Number, required: true },     // kg CO2e per unit
});

module.exports = mongoose.model("MobileCombustionEmissionFactors", MobileCombustionSchema);