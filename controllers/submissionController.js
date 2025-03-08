const Submission = require("../models/Submission");


// exports.submitData = async (req, res) => {
//   try {
//     const { userId, responses } = req.body;
// console.log("response:",responses);
//     if (!userId || !responses) {
//       return res.status(400).json({ error: "User ID and responses are required" });
//     }

//     // ✅ Subcategories that should always store multiple entries
//     const subcategoriesWithMultipleEntries = [
//       "Purchased Goods & Services",
//       "Use of Sold Products",
//       "End-of-Life Treatment of Sold Products",
//       "Mobile Combustion",
//       "Stationary Combustion",
//       "Industrial Processes"
//     ];

//     // ✅ Ensure Renewable Project stores multiple full projects
//     if (responses["Renewable Project"] && !Array.isArray(responses["Renewable Project"])) {
//       responses["Renewable Project"] = [responses["Renewable Project"]];
//     }

//     // ✅ Ensure specific subcategories are stored as arrays
//     subcategoriesWithMultipleEntries.forEach((subcategory) => {
//       if (responses[subcategory] && !Array.isArray(responses[subcategory])) {
//         responses[subcategory] = [responses[subcategory]];
//       }
//     });

//     // ✅ Find existing submission
//     let submission = await Submission.findOne({ userId });

//     if (submission) {
//       // ✅ Merge new responses with existing ones instead of overwriting
//       Object.keys(responses).forEach((key) => {
//         if (subcategoriesWithMultipleEntries.includes(key) || key === "Renewable Project") {
//           // Append to array if key should store multiple values
//           submission.responses.set(key, [
//             ...(submission.responses.get(key) || []), 
//             ...responses[key]
//           ]);
//         } else {
//           // Overwrite for single-value responses
//           submission.responses.set(key, responses[key]);
//         }
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
    if (!userId || !responses) {
      return res.status(400).json({ error: "User ID and responses are required" });
    }

    // ✅ Find existing submission
    let submission = await Submission.findOne({ userId });

    if (submission) {
      // ✅ Merge new responses with existing ones instead of overwriting
      Object.keys(responses).forEach((key) => {
        submission.responses.set(key, responses[key]);
      });

      await submission.save();
      res.status(200).json({ message: "Data merged successfully", submission });
    } else {
      // Create new submission if none exists
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


