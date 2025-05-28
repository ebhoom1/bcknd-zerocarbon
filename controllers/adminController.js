const Form = require("../models/Form");
const User=require("../models/User");

const getRegisteredUsers = async (req, res) => {
  try {
    const user = req.user;

    let users;
    if (user.userType === "superAdmin") {
      users = await User.find({ userType: { $ne: "superAdmin" } }).select("-password");
    } else if (user.userType === "admin") {
      users = await User.find({ adminId: user._id }).select("-password");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getFormById = async (req, res, next) => {
  try {
    const form = await Form.findOne({userId:req.params.id});
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    form.isRead = true;
    await form.save();

    res
      .status(200)
      .json({ message: "Form details fetched successfully", form });
  } catch (error) {
    console.error("Error fetching form details:", error);
    res.status(500).json({ message: "Error fetching form details", error });
  }
};

const getFormByFilter = async (req, res, next) => {
  try {
    const { companyName, status} = req.query;

    const filters = {userType: "user"};

    if (companyName)
      filters.companyName = { $regex: companyName, $options: "i" };
    if (status)
      filters.status = { $regex: status, $options: "i" };  

    const forms = await User.find(filters).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: "Error fetching forms" });
  }
};

const getDashboardMatrics = async (req, res, next) => {
  try {
    const totalSubmissions = await Form.countDocuments();
    const pendingActions = await Form.countDocuments({ isRead: false });

    const submissionBreakdown = await Form.aggregate([
      {
        $group: {
          _id: "$industrySector",
          count: { $sum: 1 },
        },
      },
    ]);

    const recentActivity = await Form.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("companyName industrySector updatedAt");

    console.log(
      "pendingActions:",
      pendingActions,
      "submissionBreakdown:",
      submissionBreakdown,
      "recentActivity:",
      recentActivity
    );

    res.status(200).json({
      totalSubmissions,
      pendingActions,
      submissionBreakdown,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching form details:", error);
    res
      .status(500)
      .json({
        error: "Error fetching dashboard metrics",
        details: error.message,
      });
  }
};

const leadsStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const updatedForm = await User.findByIdAndUpdate(
      { _id: id, userType: "user" },
      { status },
      { new: true }
    );
    if (!updatedForm) return res.status(404).json({ error: "Form not found" });
    console.log("status submitted");
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: "Error updating form status" });
  }
};



const updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ message: "Subscription value is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id, userType: "user" },
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({
      message: "Failed to update subscription",
      error: error.message,
    });
  }
};



const getStatusCompleted = async (req, res, next) => {
  try {
    const forms = await User.find({status:"Completed"}).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error });
  }
};

// Update user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // Hash password if present
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
};



module.exports = {
  getFormByFilter,
  getRegisteredUsers,
  getFormById,
  getDashboardMatrics,
  leadsStatus,
  updateUserSubscription,
  getStatusCompleted ,
  updateUser,
  deleteUser
};
