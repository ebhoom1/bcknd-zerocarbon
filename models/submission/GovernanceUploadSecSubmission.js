const mongoose = require("mongoose");

const GovernanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // text / boolean / file path
  },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GovernanceUploadSecSubmission", GovernanceSchema);
