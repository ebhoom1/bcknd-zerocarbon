const SectionB = require('../../models/report/sectionBsubmission');
const {generateBRSRSectionBData}=require("../../utils/report/generateBRSRSectionBData");

// Save or update Section B submission
exports.saveSectionB = async (req, res) => {
  const { userId, data } = req.body;

  try {
    let submission = await SectionB.findOne({ userId });

    if (submission) {
      submission.set(data);
      await submission.save();
    } else {
      submission = new SectionB({ userId, ...data });
      await submission.save();
    }
await generateBRSRSectionBData(userId)
    res.status(200).json({ success: true, message: 'Section B saved successfully', data: submission });
  } catch (error) {
    console.error('Error saving Section B:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get section B data by userId
exports.getSectionB = async (req, res) => {
  try {
    const submission = await SectionB.findOne({ userId: req.params.userId });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Section B not found' });
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error('Error fetching Section B:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
