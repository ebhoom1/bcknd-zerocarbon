// models/report/sectionCsubmission.js
const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({}, { strict: false });

const principleSchema = new mongoose.Schema({
  principleNumber: {
    type: Number,
    required: true
  },
  answers: {
    type: answersSchema,
    default: {}
  }
});

const sectionCSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  disclosures: [principleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure uniqueness per user-year pair
sectionCSchema.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('SectionCSubmission', sectionCSchema);
