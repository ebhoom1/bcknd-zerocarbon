const mongoose = require("mongoose");

const RenewableEnergyCalculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  energyConsumption: Number,
  renewablePercentage: Number,
  solarFeasibility: String,
  gridMix: Number,
  investmentBudget: Number,
  govIncentives: String,
  batteryStorage: Number,
  siteConstraints: String,
  analysedData: {
    scope2Impact: String,
    renewableOptions: String,
    paybackPeriod: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RenewableEnergyCalculation", RenewableEnergyCalculationSchema);
