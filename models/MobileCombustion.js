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


// const mongoose = require("mongoose");

// const MobileCombustionSchema = new mongoose.Schema({
//   sourceOfEmission: { type: String, required: true },  // e.g. Diesel Engine
//   ghgActivity: { type: String, required: true },        // e.g. BS 4 Diesel
//   units: { type: String, required: true },               // e.g. Litre
//   emissionFactor: { type: Number, required: true },     // kg CO2e per unit
// });

// module.exports = mongoose.model("MobileCombustionEmissionFactors", MobileCombustionSchema);
