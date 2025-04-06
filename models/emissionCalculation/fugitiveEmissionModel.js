const mongoose = require("mongoose");

const EmissionSchema = new mongoose.Schema({
  CO2: Number,
  CH4: Number,
  N2O: Number,
  SF6: Number,
  CO2e: Number
}, { _id: false });

const FugitiveEmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month:{type:String},
  category: String, // Refrigerant Emission / Pipeline Leak Emission
  gasType: String,
  emissionSource: String,
  quantity: Number,
  emission: EmissionSchema
}, { timestamps: true });

module.exports = mongoose.model("FugitiveEmissionCalculation", FugitiveEmissionSchema);
