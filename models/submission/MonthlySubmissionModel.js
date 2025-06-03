const mongoose = require("mongoose");

const MonthlySubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, 
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    // required: true
  },  
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure uniqueness: Only one entry per user per month
MonthlySubmissionSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlySubmission", MonthlySubmissionSchema);
