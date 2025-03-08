const mongoose = require('mongoose');

const EndOfLifeTreatmentSchema = new mongoose.Schema({
  productService: { type: String, }, // "Product/Service"
  category: { type: String, },
  endOfLifeTreatment: { type: String, required: true }, // e.g., "Landfill", "Incineration", "Recycling"
  CO2: { type: String, },   // CO2 (kg/unit)
  CH4: { type: String, },   // CH4 (kg/unit)
  N2O: { type: String, },   // N2O (kg/unit)
  CO2e: { type: String, },  // CO2e (kg/unit)
  unit: { type: String, },  // e.g., "kg/T", "kg/unit"
  source: { type: String, },  // Where these numbers came from, e.g., "IPCC Guidelines"
});

module.exports = mongoose.model('EndOfLifeTreatment', EndOfLifeTreatmentSchema);
