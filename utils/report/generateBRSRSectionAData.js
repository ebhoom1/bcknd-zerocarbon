const Submission = require("../../models/Submission");
const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const Form = require("../../models/Form");
const BRSRSectionA = require("../../models/report/BRSRSectionA");

async function generateBRSRSectionAData(userId) {
  const submission = await Submission.findOne({ userId });
  if (!MonthlySubmission || !submission) return;

  const formData = await Form.findOne({ userId });

  const mappings = [
    { qno: "14", field: "Details of Business Activities", key: "form" },
    { qno: "15", field: "Products sold / Services offered by the entity", key: "Scope3:ValueChainEmissions_UseofSoldProducts" },
    { qno: "18", field: "Details of employees and workers", key: "Social_WorkforceComposition&Diversity(Management&HRData)" },
    { qno: "19", field: "Participation /inclusion /representation of women(including differently abled)", key: "Governance_BoardStructure&Leadership" },
    { qno: "20", field: "Turnover rate for permanent employees and workers", key: "Social_TurnoverData" },
    { qno: "21", field: "Details of Holding / Subsidiary / Associate Companies / Joint Ventures", key: "Governance_DetailsofHolding/Subsidiary/AssociateCompanies/JointVentures" },
    { qno: "23", field: "Grievance Redressal mechanism for stakeholders", key: "Social_GrievanceRedressal" },
    { qno: "24", field: "Overview of the entity’s material responsible business conduct and sustainability issues", key: "Environment_SustainabilityRisks&Opportunities" },
  ];

  const newData = mappings.map(map => ({
    qno: map.qno,
    fieldName: map.field,
    report: map.key, // ✅ Only storing the key (not actual answer)
  }));

  // Upsert
  await BRSRSectionA.findOneAndUpdate(
    { userId },
    { userId, data: newData },
    { upsert: true, new: true }
  );
}

module.exports = { generateBRSRSectionAData };
