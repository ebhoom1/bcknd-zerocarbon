const { analyseRoadmap } = require("../utils/gemini");

exports.calculateRoadmap = async (req, res) => {
  try {
    const { industry, targetYear, totalEmissions, annualReduction,
        energyMix,
        technologyAdoption,
        operationalChanges,
        budgetConstraints, } = req.body;

    const analysedData = await analyseRoadmap(
      industry,
      targetYear,
      totalEmissions,
      annualReduction,
      energyMix,
      technologyAdoption,
      operationalChanges,
      budgetConstraints
    );

    if (analysedData) {
      res
        .status(200)
        .json({ message: "Roadmap analysed Successfully", analysedData });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "An error occurred while analysing calculate roadmap.",
      error: error.message,
    });
  }
};
