const mongoose = require("mongoose");

const EmissionFactorSchema = new mongoose.Schema({
  CO2: Number,
  CH4: Number,
  N2O: Number,
  CO2e: Number
}, { _id: false });

const EmissionSchema = new mongoose.Schema({
  CO2: Number,
  CH4: Number,
  N2O: Number,
  CO2e: Number
}, { _id: false });

const IndustrialProcessesEmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month:{type:String},
  industryType: String,
  emissionSource: String,
  unit: String,
  productionQtyInKg: Number,
  normalizedQty: Number,
  emissionFactor: EmissionFactorSchema,
  emission: EmissionSchema
}, { timestamps: true });

module.exports = mongoose.model("IndustrialProcessesEmission", IndustrialProcessesEmissionSchema);
