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
  },
  status: {
    type: String,
    enum: ["Free", "Paid", "Cancelled"],
  },
  startDate: Date,
  endDate: Date,
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["user", "admin","consultantadmin"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
  },
  subscription: subscriptionSchema, // Optional for admin
  consultantAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the consultantadmin user
    default: null,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
