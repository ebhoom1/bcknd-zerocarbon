const mongoose = require("mongoose");

const GRIReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: {
    type: Map, // section → disclosure → response
    of: {
      type: Map,
      of: String,
    },
  },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GRIReport", GRIReportSchema);
