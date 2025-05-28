const SectionB = require('../../models/report/sectionBsubmission');
const BRSRSectionB = require('../../models/report/BRSRSectionB');

async function generateBRSRSectionBData(userId) {
  const sectionBData = await SectionB.findOne({ userId });
  if (!sectionBData) return;

  const newData = [
    {
      qno: "5_6",
      fieldName: "Specific commitments, goals and targets set by the entity along-with performance, if any",
      report: "specificCommitments"
    },
    {
      qno: "7",
      fieldName: "Statement by director responsible for the report to highlight ESG issues",
      report: "directorESGStatement"
    },
    {
      qno: "8",
      fieldName: "Highest authority responsible for implementation and oversight of the Business Responsibility policy (ies)",
      report: "highestAuthority"
    },
    {
      qno: "9",
      fieldName: "Does the entity have a specified Committee of the Board/ Director responsible for decision making on sustainability related issues?",
      report: "sustainabilityCommittee"
    }
  ];

  await BRSRSectionB.findOneAndUpdate(
    { userId },
    { userId, data: newData },
    { upsert: true, new: true }
  );
}

module.exports = { generateBRSRSectionBData };
