const RenewableProject = require("../models/Renewableproject");

// 📌 Create a new project submission
exports.createProject = async (req, res) => {
  try {
    const newProject = new RenewableProject({
      userId: req.body.userId,
      responses: req.body.formData
    });

    await newProject.save();
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 📌 Retrieve all project submissions
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await RenewableProject.find();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Retrieve a single project submission by ID
exports.getProjectById = async (req, res) => {
    try {
      const project = await RenewableProject.find({ userId: req.params.userId }); // Fix: Search by userId
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

// 📌 Delete a project submission
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await RenewableProject.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
