const mongoose = require("mongoose");

const RenewableProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: { type: Map, of: String }, // Dynamic key-value storage
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RenewableProject", RenewableProjectSchema);
