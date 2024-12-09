const Flowchart = require("../models/Flowchart");

// Save Flowchart Data
const saveFlowchart = async (req, res) => {
  const { userId, flowchartData } = req.body;
  console.log("userIdflowchart:",userId);
  // console.log("flowchartdata:", flowchartData);
  try {
    const existingFlowchart = await Flowchart.findOne({ userId });

    if (existingFlowchart) {
      // Update existing flowchart
      existingFlowchart.nodes = flowchartData.nodes;
      existingFlowchart.edges = flowchartData.edges;
      await existingFlowchart.save();
    } else {
      // Create new flowchart
      const newFlowchart = new Flowchart({ userId, ...flowchartData });
      await newFlowchart.save();
    }
    console.log("flwchart saved successfully");
    res.status(200).json({ message: "Flowchart saved successfully" });
  } catch (error) {
    console.error("Error saving flowchart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Flowchart Data
const getFlowchart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch the flowchart from the database
    const flowchart = await Flowchart.findOne({ userId });

    if (!flowchart) {
      return res.status(404).json({ message: "Flowchart not found." });
    }

    res.status(200).json({
      nodes: flowchart.nodes.map((node) => ({
        id: node.id,
        data: {
          label: node.label,
          details: node.details || "",
        },
        position: node.position,
        ...(node.parentNode ? { parentNode: node.parentNode } : {}),
      })),
      edges: flowchart.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching flowchart." });
  }
};

module.exports = {
  saveFlowchart,
  getFlowchart,
};
