// const mongoose = require("mongoose");

// const SubmissionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   responses: { type: Map, of: String, required: true }, // Stores dynamic questions & answers
//   submittedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Submission", SubmissionSchema);


const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed, // Allows storing arrays for specific sections
    // required: true
  },  
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", SubmissionSchema);
