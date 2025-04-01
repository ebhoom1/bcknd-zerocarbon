const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Form = require("../models/Form");
const { sendMail } = require("../utils/mail");
const sendEmail = require("../utils/MailafterRegister/sendMail");


// // Parse ALLOWED_ADMIN_EMAILS from environment variables
// const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS
//   ? process.env.ALLOWED_ADMIN_EMAILS.split(",") // Split the string into an array
//   : [];

// const registerUser = async (req, res, next) => {
//   try {
//     const {
//       email,
//       password,
//       contactNumber,
//       userName,
//       userType,
//       address,
//       companyName,
//     } = req.body;

//     if (
//       !email ||
//       !password ||
//       !contactNumber ||
//       !userName ||
//       !userType ||
//       !address
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields" });
//     }

//     // If userType is admin, validate email
//     if (userType === "admin") {
//       if (!allowedAdminEmails.includes(email)) {
//         return res
//           .status(403)
//           .json({ message: "You are not authorized to register as an admin" });
//       }
//     }

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Email already in use" });
//     }

//     // Hash password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Create a new user
//     const user = new User({
//       email,
//       password: hashedPassword,
//       contactNumber,
//       userName,
//       userType,
//       address,
//       companyName,
//       isFirstLogin: true, // Default to true, can be updated on first login
//     });

//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: error.message, message: "Registration Failed" });
//   }
// };

// Parse ALLOWED_ADMIN_EMAILS from environment variables
const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS
  ? process.env.ALLOWED_ADMIN_EMAILS.split(",")
  : [];

const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      contactNumber,
      userName,
      userType,
      address,
      companyName,
      subscriptionPlan,
      paymentStatus,
      subscriptionStartDate,
      subscriptionEndDate,
    } = req.body;
console.log("req,body:",req.body)
    // Check common required fields
    if (!email || !password || !contactNumber || !userName || !userType || !address || !companyName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Admin-specific validation
    if (userType === "admin") {
      if (!allowedAdminEmails.includes(email)) {
        return res.status(403).json({ message: "You are not authorized to register as an admin" });
      }
    }

    // User-specific validation
    if (userType === "user") {
      if (!subscriptionPlan || !paymentStatus || !subscriptionStartDate || !subscriptionEndDate) {
        return res.status(400).json({ message: "Subscription details are required for user type 'user'" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      contactNumber,
      userName,
      userType,
      address,
      companyName,
      isFirstLogin: true,
      subscription: userType === "user" ? {
        plan: subscriptionPlan,
        status: paymentStatus,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
      } : undefined, // don't include subscription for admin
    });

    await newUser.save();
// Send welcome email with plan details
if (userType === "user") {
  const formattedStart = new Date(subscriptionStartDate).toLocaleDateString();
  const formattedEnd = new Date(subscriptionEndDate).toLocaleDateString();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #219653;">Welcome to Ebhoom ESG, ${userName}!</h2>
      <p>Thank you for registering with us. We're excited to have you on board 🌱</p>
      
      <h3 style="color: #2F80ED;">Your Subscription Details:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Plan</td>
          <td style="padding: 8px;">${subscriptionPlan}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Status</td>
          <td style="padding: 8px;">${paymentStatus}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Start Date</td>
          <td style="padding: 8px;">${formattedStart}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">End Date</td>
          <td style="padding: 8px;">${formattedEnd}</td>
        </tr>
      </table>

      <p>If you have any questions or need help, feel free to reply to this email.</p>

      <p style="margin-top: 30px;">Warm regards,<br/>Team Ebhoom ESG</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to Ebhoom ESG - Subscription Confirmation",
    html: htmlContent,
  });
}

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Registration Failed" });
  }
};


// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Check password match
//     const isMatch = bcrypt.compareSync(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     // If it's the user's first login, update 'isFirstLogin' to false
//     if (user.isFirstLogin) {
//       user.isFirstLogin = true;
//       await user.save(); // Save the updated user object
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "10d",
//     });

//     res.status(200).json({
//       user: {
//         id: user._id,
//         email: user.email,
//         contactNumber: user.contactNumber,
//         userName: user.userName,
//         userType: user.userType,
//         address: user.address,
//         companyName: user.companyName,
//         isFirstLogin: user.isFirstLogin, // Will be false after the first login
//       },
//       token,
//       message: "login successfull",
//     });
//     console.log("login successfull");
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // If first login, update the flag
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    // Build response
    const responseUser = {
      id: user._id,
      email: user.email,
      contactNumber: user.contactNumber,
      userName: user.userName,
      userType: user.userType,
      address: user.address,
      companyName: user.companyName,
      isFirstLogin: user.isFirstLogin,
      subscription: user.subscription || null, // Can be null for admin
    };

    res.status(200).json({
      user: responseUser,
      token,
      message: "Login successful",
    });
    console.log("Login successful");
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
