const mongoose = require('mongoose');

const purchasedgoodsservicesSchema = new mongoose.Schema({
  productService: { type: String, required: true }, // "Product/Service"
  category: { type: String, required: true },
  CO2: { type: Number, required: true },   // CO₂ (kg/unit)
  CH4: { type: Number, required: true },   // CH₄ (kg/unit)
  N2O: { type: Number, required: true },   // N₂O (kg/unit)
  CO2e: { type: Number, required: true },  // CO₂e (kg/unit)
  unit: { type: String, required: true },  // e.g., "kg/T", "kg/L", etc.
  source: { type: String, required: true }, // The "Source" column
});

module.exports = mongoose.model('purchasedgoodsservices', purchasedgoodsservicesSchema);
