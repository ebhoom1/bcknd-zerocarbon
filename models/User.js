// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     contactNumber: { type: String, required: true },
//     userName: { type: String, required: true },
//     password: { type: String, required: true },
//     userType: {
//       type: String,
//       required: true,
//       enum: ["user", "admin","superAdmin"],
//     },
//     address: { type: String, required: true },
//     companyName: { type: String },
//     isFirstLogin: { type: Boolean, default: false },
//     status: { type: String, default: "Not started" },
//     subscription: { type: String,default:"Basic"  }

//   },   
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ["Free Trial", "ESG Basic", "ESG Standard", "ESG Premium"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Free", "Paid", "Cancelled"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userType: {
    type: String,
    enum: ["user", "admin", "superAdmin"],
    required: true,
  },
  address: { type: String, required: true },
  companyName: { type: String, required: true },
  isFirstLogin: { type: Boolean, default: true },

  // Subscription is only required for user accounts
  subscription: {
    type: subscriptionSchema,
    default: null,
  },

  // Refers to the admin (or consultant) who created the user
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
