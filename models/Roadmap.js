const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  milestone: String,
  start: Number,
  end: Number,
  reduction: Number,
});

const roadmapSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  industry: { type: String, required: true },
  targetYear: { type: Number, required: true },
  totalEmissions: { type: Number, required: true },
  annualReduction: { type: Number, required: true },
  energyMix: { type: String, required: true },
  technologyAdoption: { type: String, required: true },
  operationalChanges: { type: String, required: true },
  budgetConstraints: { type: Number, required: true },
  milestones: [milestoneSchema],
}, { timestamps: true });

module.exports = mongoose.model("Roadmap", roadmapSchema);
