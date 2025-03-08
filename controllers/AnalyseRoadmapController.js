const { analyseRoadmap } = require("../utils/gemini");
const Roadmap = require("../models/Roadmap");
const User=require("../models/User");


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


exports.saveRoadmap = async (req, res) => {
  try {
    const { userId,industry, targetYear, totalEmissions, annualReduction, energyMix, technologyAdoption, operationalChanges, budgetConstraints, roadmapData } = req.body;

    const roadmap = new Roadmap({
      userId,
      industry,
      targetYear,
      totalEmissions,
      annualReduction,
      energyMix,
      technologyAdoption,
      operationalChanges,
      budgetConstraints,
      milestones: roadmapData,
    });

    await roadmap.save();
    res.status(201).json({ message: "Roadmap saved successfully", roadmap });
  } catch (error) {
    console.error("Error saving roadmap:", error);
    res.status(500).json({ message: "Error saving roadmap", error: error.message });
  }
};

exports.getSavedRoadmaps = async (req, res) => {
  // try {
  //   const roadmaps = await Roadmap.find().sort({ createdAt: -1 }); // Fetch all roadmaps sorted by latest
  //   res.status(200).json({ roadmaps });
  // } catch (error) {
  //   console.error("Error fetching saved roadmaps:", error);
  //   res.status(500).json({ message: "Error retrieving saved roadmaps", error: error.message });
  // }

  try {
    const { userId } = req.params;

    // Find the user to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch roadmaps associated with the user
    const roadmaps = await Roadmap.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({ roadmaps });
  } catch (error) {
    console.error("Error fetching user roadmaps:", error);
    res.status(500).json({ message: "Error retrieving user roadmaps", error: error.message });
  }
};