const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Form = require("../models/Form");
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
      expiresIn: "10d",
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

const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from request parameters
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide both current and new passwords" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message, message: "Password update failed" });
  }
};


const getUsersWithUserTypeUser = async (req, res) => {
  try {
    const users = await User.find({ userType: "user" });

    if (!users.length) {
      return res.status(404).json({
        message: "No users with userType 'user' found.",
      });
    }
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
      error: error.message,
    });
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

module.exports = {
  registerUser,
  login,
  updatePassword,
  formSubmission,
  getUsersWithUserTypeUser,
};
