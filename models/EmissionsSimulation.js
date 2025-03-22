const mongoose = require("mongoose");

const EmissionsSimulationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  strategyAdjustments: String,
  energyConsumption: Number,
  fuelUsage: Number,
  buildingEfficiency: String,
  vehicleFleet: String,
  wasteManagement: String,
  carbonCapture: Number,
  financialConstraints: Number,
  policyChanges: String,
  aiResponse: {
    reduction: Number,
    savings: Number,
    investment: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("EmissionsSimulation", EmissionsSimulationSchema);
