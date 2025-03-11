const Submission = require("../models/Submission");




// exports.submitData = async (req, res) => {
//   try {
//     const { userId, responses } = req.body;
//     console.log("responses:",responses);
//     if (!userId || !responses) {
//       return res.status(400).json({ error: "User ID and responses are required" });
//     }

//     // ✅ Find existing submission
//     let submission = await Submission.findOne({ userId });

//     if (submission) {
//       // ✅ Merge new responses with existing ones instead of overwriting
//       Object.keys(responses).forEach((key) => {
//         submission.responses.set(key, responses[key]);
//       });

//       await submission.save();
//       res.status(200).json({ message: "Data merged successfully", submission });
//     } else {
//       // Create new submission if none exists
//       submission = new Submission({ userId, responses });
//       await submission.save();
//       res.status(201).json({ message: "Data submitted successfully", submission });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error: Unable to submit data" });
//   }
// };

exports.submitData = async (req, res) => {
  try {
    const { userId, responses } = req.body;
    console.log("responses:", responses);
    
    if (!userId || !responses) {
      return res.status(400).json({ error: "User ID and responses are required" });
    }

    let submission = await Submission.findOne({ userId });

    if (submission) {
      // ✅ Merge each key
      Object.keys(responses).forEach((key) => {
        const newEntries = responses[key];

        // If previous entries exist, merge them
        if (submission.responses.has(key)) {
          const existingEntries = submission.responses.get(key);
          const mergedEntries = Array.isArray(existingEntries)
            ? [...existingEntries, ...newEntries]
            : [...newEntries]; // fallback if somehow not array
          submission.responses.set(key, mergedEntries);
        } else {
          // If key doesn't exist, just set it
          submission.responses.set(key, newEntries);
        }
      });

      await submission.save();
      res.status(200).json({ message: "Data merged successfully", submission });
    } else {
      // New submission
      submission = new Submission({ userId, responses });
      await submission.save();
      res.status(201).json({ message: "Data submitted successfully", submission });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to submit data" });
  }
};


// GET USER SUBMISSION (BY USER ID)
exports.getUserSubmission = async (req, res) => {
  try {
    const { userId } = req.params;
    const submission = await Submission.findOne({ userId });

    if (!submission) {
      return res.status(404).json({ message: "No submission found for this user" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to fetch data" });
  }
};

//  GET ALL SUBMISSIONS (ADMIN USE-CASE)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to fetch all submissions" });
  }
};


