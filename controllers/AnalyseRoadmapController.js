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


// exports.saveRoadmap = async (req, res) => {
//   try {
//     const { userId,industry, targetYear, totalEmissions, annualReduction, energyMix, technologyAdoption, operationalChanges, budgetConstraints, roadmapData } = req.body;

//     const roadmap = new Roadmap({
//       userId,
//       industry,
//       targetYear,
//       totalEmissions,
//       annualReduction,
//       energyMix,
//       technologyAdoption,
//       operationalChanges,
//       budgetConstraints,
//       milestones: roadmapData,
//     });

//     await roadmap.save();
//     res.status(201).json({ message: "Roadmap saved successfully", roadmap });
//   } catch (error) {
//     console.error("Error saving roadmap:", error);
//     res.status(500).json({ message: "Error saving roadmap", error: error.message });
//   }
// };

exports.saveRoadmap = async (req, res) => {
  try {
    const { userId, industry, targetYear, totalEmissions, annualReduction, energyMix, technologyAdoption, operationalChanges, budgetConstraints, roadmapData } = req.body;

    // Fetch the user to check the subscription type
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define limits based on subscription type
    const roadmapLimits = {
      Basic: 1,
      Standard: 3,
      Premium: Infinity, // Allow unlimited for Premium or higher tiers
    };

    const userSubscription = user.subscription || "Basic"; // Default to Basic if not set
    const maxAllowedRoadmaps = roadmapLimits[userSubscription];

    // Count the existing roadmaps created by the user
    const existingRoadmapCount = await Roadmap.countDocuments({ userId });

    // Restrict roadmap saving if the limit is exceeded
    if (existingRoadmapCount >= maxAllowedRoadmaps) {
      return res.status(403).json({
        message: `Your ${userSubscription} subscription allows only ${maxAllowedRoadmaps} roadmap(s). Upgrade your plan to save more.`,
      });
    }

    // Create and save the roadmap
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