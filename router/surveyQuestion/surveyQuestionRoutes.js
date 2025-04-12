const express = require("express");
const router = express.Router();
const addDynamicQuestion = require("../../controllers/emsData/dynamicQuestions");

router.post("/survey-questions", addDynamicQuestion.addDynamicQuestion); 
router.get("/survey-questions/:userName", addDynamicQuestion.getSurveyQuestionsByUserName); 

module.exports = router;