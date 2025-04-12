const GovernanceSubmission = require("../../models/submission/GovernanceUploadSecSubmission");
const path = require("path");
const fs = require("fs");

exports.submitGovernanceForm = async (req, res) => {
  try {
    const { userId } = req.body;
    const responses = JSON.parse(req.body.responses);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        responses[file.fieldname] = file.path; // set uploaded file path
      });
    }

    const submission = new GovernanceSubmission({ userId, responses });
    await submission.save();

    res.status(200).json({ message: "Submission saved successfully!" });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Submission failed", details: err.message });
  }
};
