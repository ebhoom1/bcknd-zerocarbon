// models/BRSRSectionA.js
const mongoose = require("mongoose");

const brsrSectionASchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: [
    {
      qno: String,           // e.g. "14"
      fieldName: String,     // e.g. "Details of Business Activities"
      report: String         // structured answer text
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BRSRSectionA", brsrSectionASchema);
