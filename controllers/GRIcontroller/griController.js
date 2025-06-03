const GRISubmission = require("../../models/GRI/GRISubmission");

// Save or Update GRI responses
exports.saveGRIResponses = async (req, res) => {
  const { userId, responses } = req.body;

  if (!userId || !responses) {
    return res.status(400).json({ success: false, message: "Missing userId or responses" });
  }

  try {
    // Check if already submitted
    const existing = await GRISubmission.findOne({ userId });

    if (existing) {
      existing.responses = responses;
      existing.submittedAt = new Date();
      await existing.save();
      return res.status(200).json({ success: true, message: "Responses updated" });
    } else {
      const newSubmission = new GRISubmission({ userId, responses });
      await newSubmission.save();
      return res.status(201).json({ success: true, message: "Responses saved" });
    }
  } catch (error) {
    console.error("Error saving GRI responses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch GRI responses for a user
exports.getGRIResponses = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await GRISubmission.findOne({ userId });

    if (!data) {
      return res.status(404).json({ success: false, message: "No responses found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching GRI responses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
