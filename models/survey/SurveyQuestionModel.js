const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  section: { type: String },
  type: { type: String, enum: ['text', 'boolean', 'number', 'multiple-choice'], required: true },
  options: [String], // Only used if type is multiple-choice
});

const UserSurveySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  companyName: { type: String, required: true },
  staticQuestions: [QuestionSchema],   // Shared template copied per user
  dynamicQuestions: [QuestionSchema],  // Created by user
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserSurvey", UserSurveySchema);
