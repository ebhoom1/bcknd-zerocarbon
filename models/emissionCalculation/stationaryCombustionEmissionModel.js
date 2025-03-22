const mongoose = require("mongoose");

const EmissionSchema = new mongoose.Schema({
  totalCO2: Number,
  totalCH4: Number,
  totalN2O: Number,
  totalSF6: Number,
  totalCO2e: Number
}, { _id: false });

const StationaryCombustionEmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fuelType: String,
  fuelUnit: String,
  annualFuelConsumption: Number,
  emissionFactorCO2: Number,
  emissionFactorCH4: Number,
  emissionFactorN2O: Number,
  emissionFactorSF6: Number,
  emissionFactorCO2e: Number,
  emission: EmissionSchema
}, { timestamps: true });

module.exports = mongoose.model("StationaryCombustionEmission", StationaryCombustionEmissionSchema);
