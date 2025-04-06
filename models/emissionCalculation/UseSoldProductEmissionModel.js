const mongoose = require("mongoose");

const useSoldProductEmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month:{type:String},
  productName: {
    type: String,
    required: true
  },
  unitsSold: {
    type: Number,
    required: true
  },
  requiresEnergy: {
    type: Boolean,
    default: false
  },
  energyUsePerYear: {
    type: Number,
    default: 0
  },
  lifetimeYears: {
    type: Number,
    default: 0
  },
  CO2: {
    type: Number,
    required: true
  },
  CH4: {
    type: Number,
    required: true
  },
  N2O: {
    type: Number,
    required: true
  },
  CO2e: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UseSoldProductEmission", useSoldProductEmissionSchema);
