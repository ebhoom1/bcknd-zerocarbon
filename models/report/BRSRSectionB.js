// models/BRSRSectionB.js
const mongoose = require("mongoose");

const brsrSectionBSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  data: [
    {
      qno: String,          // e.g., "5_6"
      fieldName: String,    // e.g., "Specific Commitments, Goals and Performance"
      report: String        // key reference to response map
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BRSRSectionB", brsrSectionBSchema);
