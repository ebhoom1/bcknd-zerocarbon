const mongoose = require("mongoose");

const StationaryCombustionSchema = new mongoose.Schema({
  ghgScope: { type: String, default: "Scope 1" },
  ghgCategory: { type: String, default: "Stationary Combustion" },
  sourceOfEmission: { type: String, required: true },
  ghgActivity: { type: String, default: "Diesel consumption" },
  unit: { type: String, default: "L" },
  co2eFactor: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("StationaryCombustion", StationaryCombustionSchema);
