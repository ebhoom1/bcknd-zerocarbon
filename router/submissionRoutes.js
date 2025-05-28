const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const renewableproject=require('../controllers/renewableProjectController');
const { submitMonthlyEnvironment,getMonthlyUserSubmission } = require("../controllers/submission/monthlySubmissionController");




router.post("/submit", submissionController.submitData);
router.post("/monthly-submission", submitMonthlyEnvironment);
router.post("/submissions/:userId", getMonthlyUserSubmission);
router.post("/renewableproject/add", renewableproject.createProject);
router.get("/renewableproject/get/:userId", renewableproject.getProjectById);
router.get("/:userId", submissionController.getUserSubmission);
router.get("/", submissionController.getAllSubmissions);



module.exports = router;


