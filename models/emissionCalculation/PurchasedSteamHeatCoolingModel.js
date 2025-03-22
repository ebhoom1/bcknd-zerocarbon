// models/PurchasedSteamHeatCoolingModel.js
const mongoose = require('mongoose');

const PurchasedSteamHeatCoolingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consumption: { type: Number, required: true }, 
  unit: { type: String, required: true }, // GJ or MWh
  emissionFactor: { type: Number, required: true }, // kg CO2e per unit
  considerLosses: { type: Boolean, default: false },
  lossPercent: { type: Number, default: 0 },
  totalEmission: { type: Number, required: true }, // final kg CO2e
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchasedSteamHeatCooling', PurchasedSteamHeatCoolingSchema);
