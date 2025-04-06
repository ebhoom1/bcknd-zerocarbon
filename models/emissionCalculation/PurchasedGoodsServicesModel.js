// models/emissionCalculation/PurchasedGoodsServicesModel.js
const mongoose = require("mongoose");

const PurchasedGoodsServicesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month:{type:String},
  material: { type: String, required: true },
  quantity: { type: Number, required: true },
  quantityUnit: { type: String, enum: ["Kg", "Unit"], required: true },

  // Emission Factors
  emissionFactorCO2: { type: Number, required: true },
  emissionFactorCH4: { type: Number, required: true },
  emissionFactorN2O: { type: Number, required: true },
  emissionFactorCO2e: { type: Number, required: true },

  // Emission Calculated Outputs in kg
  emissionCO2: { type: Number, required: true },
  emissionCH4: { type: Number, required: true },
  emissionN2O: { type: Number, required: true },
  emissionCO2e: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("PurchasedGoodsServicesEmission", PurchasedGoodsServicesSchema);
