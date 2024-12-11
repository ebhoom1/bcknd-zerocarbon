const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      required: true,
      enum: ["user", "admin","superAdmin"],
    },
    address: { type: String, required: true },
    companyName: { type: String },
    isFirstLogin: { type: Boolean, default: false },
  },   
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
