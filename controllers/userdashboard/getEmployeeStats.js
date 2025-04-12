const Submission = require("../../models/Submission");

const getEmployeeStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await Submission.find({ userId }).sort({ createdAt: -1 });

    for (const entry of submissions) {
      const responses = entry.responses || {};
      const hrArray = responses.get("Social_WorkforceComposition&Diversity(Management&HRData)");

      if (Array.isArray(hrArray) && hrArray.length > 0) {
        const data = hrArray[0];

        const totalEmployees = parseInt(data["WorkforceComposition&Diversity(Management&HRData)_Q1"]) || 0;
        const female = parseInt(data["WorkforceComposition&Diversity(Management&HRData)_Q2_F1"]) || 0;
        const male = parseInt(data["WorkforceComposition&Diversity(Management&HRData)_Q2_F2"]) || 0;
        const other = parseInt(data["WorkforceComposition&Diversity(Management&HRData)_Q2_F3"]) || 0;

        return res.status(200).json({
          success: true,
          data: { totalEmployees, female, male, other }
        });
      }
    }

    return res.status(404).json({ success: false, message: "No HR data found" });

  } catch (err) {
    console.error("Error fetching employee stats:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = getEmployeeStats;
