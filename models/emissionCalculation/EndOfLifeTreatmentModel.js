// models/EndOfLifeTreatmentModel.js

const mongoose = require("mongoose");

const EndOfLifeTreatmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month:{type:String},
    product: { type: String, required: true },
    method: { type: String, required: true },
    percentage: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // "kg" or "units" from user input
    unitUsed: { type: String, required: true }, // "kg/T" or "kg/unit" from emission factor

    CO2: { type: Number, required: true },
    CH4: { type: Number, required: true },
    N2O: { type: Number, required: true },
    CO2e: { type: Number, required: true },

    emissionFactor_CO2: { type: Number, required: true },
    emissionFactor_CH4: { type: Number, required: true },
    emissionFactor_N2O: { type: Number, required: true },
    emissionFactor_CO2e: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EndOfLifeTreatmentEmission", EndOfLifeTreatmentSchema);
