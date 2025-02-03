const Flowchart = require("../models/Flowchart");
const mongoose = require("mongoose");

const saveFlowchart = async (req, res) => {
  const { userId, flowchartData } = req.body;

  if (
    !userId ||
    !flowchartData ||
    !flowchartData.nodes ||
    !flowchartData.edges
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields: userId or flowchart data" });
  }

  try {
    const existingFlowchart = await Flowchart.findOne({ userId });

    const nodes = flowchartData.nodes.map((node) => ({
      // id: node.id,
      id: new mongoose.Types.ObjectId(node.id), // Ensure ObjectId
      label: node.label,
      position: node.position,
      parentNode: node.parentNode || null,
      details:
        typeof node.details === "object"
          ? node.details
          : {
              boundaryDetails: {},
              scopeDetails: [],
            }, // Ensure details is always an object
    }));

    const edges = flowchartData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));

    if (existingFlowchart) {
      existingFlowchart.nodes = nodes;
      existingFlowchart.edges = edges;
      await existingFlowchart.save();
    } else {
      const newFlowchart = new Flowchart({ userId, nodes, edges });
      console.log("newflowchart:", newFlowchart);
      await newFlowchart.save();
    }
    res.status(200).json({ message: "Flowchart saved successfully" });
  } catch (error) {
    console.error("Error saving flowchart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getFlowchart = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const flowchart = await Flowchart.findOne({ userId });

    if (!flowchart) {
      return res.status(404).json({ message: "Flowchart not found." });
    }

    res.status(200).json({
      nodes: flowchart.nodes.map((node) => ({
        // id: node.id,
        id: node.id.toString(), // Convert ObjectId to string
        data: {
          label: node.label,
          details: node.details,
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
    console.error("Error fetching flowchart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateFlowchartAdmin = async (req, res) => {
  const { userId, nodeId, updatedData } = req.body;

  if (!userId || !nodeId || !updatedData) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    // Find the flowchart by userId
    const flowchart = await Flowchart.findOne({ userId });
    if (!flowchart) {
      return res.status(404).json({ message: "Flowchart not found." });
    }

    // Convert nodeId to ObjectId for comparison
    const objectIdNodeId = new mongoose.Types.ObjectId(nodeId);

    // Check if the node exists in the flowchart
    const nodeIndex = flowchart.nodes.findIndex((node) =>
      node.id.equals(objectIdNodeId)
    );

    if (nodeIndex === -1) {
      return res.status(404).json({ message: "Node not found." });
    }

    // Use $set to update only the fields provided in updatedData
    const updatedNodeKey = `nodes.${nodeIndex}`;
    const updateQuery = {
      $set: {
        [`${updatedNodeKey}.label`]: updatedData.label,
        [`${updatedNodeKey}.details.boundaryDetails`]: {
          ...flowchart.nodes[nodeIndex].details?.boundaryDetails,
          ...updatedData.details?.boundaryDetails,
        },
      },
    };

    // Update the specific node in the database
    const updatedFlowchart = await Flowchart.findByIdAndUpdate(
      flowchart._id,
      updateQuery,
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({ message: "Node updated successfully.", updatedFlowchart });
  } catch (error) {
    console.error("Error updating node:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteFlowchartAdmin = async (req, res) => {
  const { userId, nodeId } = req.body;

  try {
    // Find the flowchart document for the given userId
    const flowchart = await Flowchart.findOne({ userId });

    if (!flowchart) {
      return res.status(404).json({ message: "Flowchart not found." });
    }

    // Filter out the node to delete
    flowchart.nodes = flowchart.nodes.filter((node) => node.id !== nodeId);

    // Filter out the edges connected to the node
    flowchart.edges = flowchart.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    // Save the updated flowchart
    await flowchart.save();

    res.status(200).json({ message: "Node and edges deleted successfully." });
  } catch (error) {
    console.error("Error deleting node:", error);
    res.status(500).json({ message: "Failed to delete node.", error });
  }
};

module.exports = {
  saveFlowchart,
  getFlowchart,
  updateFlowchartAdmin,
  deleteFlowchartAdmin,
};
