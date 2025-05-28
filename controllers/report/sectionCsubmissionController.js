const SectionC = require('../../models/report/sectionCsubmission');
const { generateBRSRSectionCData } = require('../../utils/report/generateBRSRSectionCData');

// Save Section C data
exports.saveSectionC = async (req, res) => {
  const { userId, year, data } = req.body;

  try {
    let submission = await SectionC.findOne({ userId, year });

    if (submission) {
      // Check if any of the incoming principleNumbers already exist
      const submittedPrincipleNumbers = submission.disclosures.map(d => d.principleNumber);
      const newPrinciples = data.disclosures.map(d => d.principleNumber);

      const alreadySubmitted = newPrinciples.find(p => submittedPrincipleNumbers.includes(p));

      if (alreadySubmitted) {
        return res.status(409).json({
          success: false,
          message: `Principle ${alreadySubmitted} for year ${year} is already submitted.`,
        });
      }

      // Otherwise, add the new principles to existing
      submission.disclosures.push(...data.disclosures);
    } else {
      // New submission for this year
      submission = new SectionC({
        userId,
        year,
        disclosures: data.disclosures,
      });
    }

    await submission.save();
await generateBRSRSectionCData(userId,year);
    res.status(200).json({
      success: true,
      message: `Section C principle(s) for ${year} saved successfully.`,
      data: submission,
    });

  } catch (error) {
    console.error('❌ Error saving Section C:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Get Section C data by userId and optional year
exports.getSectionC = async (req, res) => {
  const { userId } = req.params;
  const year = req.query.year || new Date().getFullYear();

  try {
    const submission = await SectionC.findOne({ userId, year });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: `No Section C data found for year ${year}`,
      });
    }

    res.status(200).json({ success: true, data: submission });

  } catch (error) {
    console.error('❌ Error fetching Section C:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
