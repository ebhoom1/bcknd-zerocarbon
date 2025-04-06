// models/PurchasedElectricityModel.js
const mongoose = require('mongoose');

const PurchasedElectricitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month:{type:String},
  electricityConsumptionKWh: { type: Number, required: true },
  emissionFactor: { type: Number, required: true }, // kg CO2e/kWh
  emissionKgCO2e: { type: Number, required: true },
  source: { type: String },
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchasedElectricity', PurchasedElectricitySchema);
