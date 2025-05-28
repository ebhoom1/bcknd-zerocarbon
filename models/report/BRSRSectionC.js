// models/report/BRSRSectionC.js

const mongoose = require("mongoose");

const reportItemSchema = new mongoose.Schema({
  qno: { type: String, required: true },
  fieldName: { type: String, required: true },
  report: [{ type: String, required: true }]
}, { _id: false });

const brsrSectionCSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: String, required: true },
  data: {
    principle1: [reportItemSchema],
    principle2: [reportItemSchema],
    principle3: [reportItemSchema],
    principle4: [reportItemSchema],
    principle5: [reportItemSchema],
    principle6: [reportItemSchema],
    principle7: [reportItemSchema],
    principle8: [reportItemSchema],
    principle9: [reportItemSchema]
  }
}, { timestamps: true });

module.exports = mongoose.model("BRSRSectionC", brsrSectionCSchema);
