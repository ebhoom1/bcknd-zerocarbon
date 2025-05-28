// controller/userSurveyController.js
const UserSurvey = require("../../models/survey/SurveyQuestionModel");

exports.addDynamicQuestion = async (req, res) => {
  try {
    const { userId, companyName, question, section, options } = req.body;

    const userSurvey = await UserSurvey.findOneAndUpdate(
      { userId },
      {
        $push: {
          dynamicQuestions: {
            question,
            section,
            options,
            type: "multiple-choice" // 👈 hardcoded for all dynamic questions
          }
        },
        $setOnInsert: { companyName }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Dynamic question added successfully", data: userSurvey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSurveyQuestionsByUserName = async (req, res) => {
    try {
      const { companyName } = req.params;
  
      const survey = await UserSurvey.findOne({ companyName });
  
      if (!survey) {
        return res.status(404).json({ message: "Survey not found for this user" });
      }
  
      res.status(200).json({
        message:"survey questions get successfully",
        staticQuestions: survey.staticQuestions,
        dynamicQuestions: survey.dynamicQuestions,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  