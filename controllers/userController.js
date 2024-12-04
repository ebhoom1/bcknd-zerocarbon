const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Form = require("../models/Form");
const Boundary = require("../models/Boundary");
const Scope = require("../models/Scope");
const ProcessFlow=require('../models/Processflow');
const { sendMail } = require("../utils/mail");

// Parse ALLOWED_ADMIN_EMAILS from environment variables
const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS
  ? process.env.ALLOWED_ADMIN_EMAILS.split(",") // Split the string into an array
  : [];

const registerUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      contactNumber,
      userName,
      userType,
      address,
      companyName,
    } = req.body;

    if (
      !email ||
      !password ||
      !contactNumber ||
      !userName ||
      !userType ||
      !address
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // If userType is admin, validate email
    if (userType === "admin") {
      if (!allowedAdminEmails.includes(email)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to register as an admin" });
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      contactNumber,
      userName,
      userType,
      address,
      companyName,
      isFirstLogin: true, // Default to true, can be updated on first login
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Registration Failed" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password match
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // If it's the user's first login, update 'isFirstLogin' to false
    if (user.isFirstLogin) {
      user.isFirstLogin = true;
      await user.save(); // Save the updated user object
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        contactNumber: user.contactNumber,
        userName: user.userName,
        userType: user.userType,
        address: user.address,
        companyName: user.companyName,
        isFirstLogin: user.isFirstLogin, // Will be false after the first login
      },
      token,
      message: "login successfull",
    });
    console.log("login successfull");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const formSubmission = async (req, res) => {
  try {
    const { formData, userId } = req.body;

    // Save form data
    const form = new Form({ ...formData, userId });
    await form.save();

    // Update user login status
    const user = await User.findById(userId);
    user.isFirstLogin = false;
    await user.save();

    // Fetch admin and superAdmin emails
    const adminEmails = await User.find(
      { userType: { $in: ["admin", "superAdmin"] } },
      "email"
    );

    const emailList = adminEmails.map((admin) => admin.email);

    // Prepare email summary
    const emailSubject = "New Form Submission Received";
    const emailMessage = `
      A new form submission has been received from  ${formData.companyName}

      // User ID: ${userId}
      // Submitted Details: ${JSON.stringify(formData, null, 2)}

      Please review the submission in the admin dashboard.
    `;

    // Send email notification (don't block response)
    sendMail(emailList.join(","), emailSubject, emailMessage)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((err) => {
        console.error("Failed to send email notification:", err);
      });

    // Always send success response to frontend
    res.status(201).json({
      message:
        "Thank you for submitting your information. Our team will review your details and get in touch with you shortly.",
    });
  } catch (error) {
    console.error("Error during form submission:", error);
    res.status(500).json({
      message: "An error occurred while submitting the form",
      error: error.message,
    });
  }
};


const getBoundariesScope = async (req, res, next) => {
  try {
    const boundaries = await Boundary.find();
   const scopes=await Scope.find();

    res.status(200).json({boundaries,scopes});
  } catch (error) {
    console.log("Failed to get boundaries", error);
    res.status(500).json({ message: "Error fetching boundaries", error });
  }
};



const createBoundaryScope = async (req, res, next) => {
  const { boundary, scope } = req.body;
  console.log(" Body:", req.body);
  try {
    const newBoundary = new Boundary({
      ...boundary,
    });

    const savedBoundary = await newBoundary.save();
console.log("boundary:",savedBoundary)
    const newScope = new Scope({
      boundaryId: savedBoundary._id,
      ...scope,
    });

    const savedScope = await newScope.save();
    console.log("scope",savedScope)

    res.status(200).json({savedBoundary, savedScope});
  } catch (error) {
    console.log("Failed to create boundary", error);
    res.status(500).json({ message: "Error creating boundary", error });
  }
};





const postProcessFlowChart = async (req, res, next) => {
  const { processName, nodes, edges } = req.body;

  try {
    // Find the process flow by name
    let processFlow = await ProcessFlow.findOne({ processName });

    if (processFlow) {
      // If a process flow with the same name exists, append new nodes and edges
      processFlow.nodes = [...processFlow.nodes, ...nodes];
      processFlow.edges = [...processFlow.edges, ...edges];

      const updatedProcessFlow = await processFlow.save();
      res.status(200).json(updatedProcessFlow);
    } else {
      // If no existing process flow, create a new one
      const newProcessFlow = new ProcessFlow({ processName, nodes, edges });
      const savedProcessFlow = await newProcessFlow.save();
      res.status(201).json(savedProcessFlow);
    }
  } catch (error) {
    console.error("Error saving process flow:", error);
    res.status(500).json({ message: 'Error saving process flow', error });
  }
};


const getProcessFlowChart=async(req,res,next)=>{
  try {
    const processFlows = await ProcessFlow.find();
    res.status(200).json(processFlows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching process flows', error });
  }
}




const deleteNode = async (req, res, next) => {
  const { boundaryId, fieldName, nodeId } = req.body;

  try {
    // Step 1: Update ProcessFlow
    const processFlow = await ProcessFlow.findOne();
    if (!processFlow) {
      return res.status(404).json({ message: "Process flow not found" });
    }

    processFlow.nodes = processFlow.nodes.filter((node) => node.id !== nodeId);
    processFlow.edges = processFlow.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    await processFlow.save();

    // Step 2: Update Boundary model
    const boundary = await Boundary.findById(boundaryId);
    if (!boundary) {
      return res.status(404).json({ message: "Boundary not found" });
    }

    await Boundary.updateOne({ _id: boundaryId }, { $unset: { [fieldName]: 1 } });


    res
      .status(200)
      .json({ message: "Node and associated field deleted successfully" });
  } catch (error) {
    console.error("Error deleting node or field:", error);
    res.status(500).json({ message: "Error deleting node or field", error });
  }
};

const deleteEdge=async(req,res)=>{
  const { edgeId } = req.body; 
  try {
    const processFlow = await ProcessFlow.findOne();
    if (!processFlow) {
      return res.status(404).json({ message: 'Process flow not found' });
    }

    // Remove the edge from the edges array
    processFlow.edges = processFlow.edges.filter(edge => edge.id !== edgeId);

    // Save the updated process flow
    await processFlow.save();
    res.status(200).json({ message: 'Edge deleted' });
  } catch (error) {
    console.error('Error deleting edge:', error);
    res.status(500).json({ message: 'Error deleting edge', error });
  }
}

const updateBoundaryScope = async (req, res, next) => {
  const { boundaryId, scopeId, boundary, scope } = req.body;

  try {
    // Update the Boundary if there are fields to update
    let updatedBoundary = {};
    if (boundary && Object.keys(boundary).length > 0) {
      updatedBoundary = await Boundary.findByIdAndUpdate(
        boundaryId,
        { $set: boundary },
        { new: true, runValidators: true } // Return the updated document
      );
    }

    // Update the Scope if there are fields to update
    let updatedScope = {};
    if (scope && Object.keys(scope).length > 0) {
      updatedScope = await Scope.findByIdAndUpdate(
        scopeId,
        { $set: scope },
        { new: true, runValidators: true } // Return the updated document
      );
    }

    res.status(200).json({
      message: "Successfully updated",
      updatedBoundary,
      updatedScope,
    });
  } catch (error) {
    console.error("Failed to update boundary or scope:", error);
    res.status(500).json({ message: "Error updating boundary or scope", error });
  }
};

module.exports = {
  deleteEdge,
  deleteNode,
  registerUser,
  login,
  formSubmission,
  getBoundariesScope,
  createBoundaryScope,
  getProcessFlowChart,
  postProcessFlowChart,
  updateBoundaryScope,
};
