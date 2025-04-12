const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");

const getMonthlyWasteGenerated = async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await MonthlySubmission.find({ userId });
    const yearData = {};

    for (const entry of submissions) {
      const [month, year] = entry.month?.split("-") || [];
      if (!month || !year) continue;

      const responses = entry.responses || {};
      let waste = 0;

      // ♻️ WASTE → Extract from relevant scope
      const wasteArray = responses.get("Scope3:ValueChainEmissions_WasteGeneration");
      if (Array.isArray(wasteArray) && wasteArray.length > 0) {
        const value = wasteArray[0]["WasteGeneration_Q1"];
        waste = parseFloat(value);
      }

      if (!yearData[year]) yearData[year] = [];
      yearData[year].push({
        month: `${month}-${year}`,
        waste,
      });
    }
    return res.status(200).json({ success: true, data: yearData });
  } catch (err) {
    console.error("❌ Error fetching waste data:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = getMonthlyWasteGenerated;
