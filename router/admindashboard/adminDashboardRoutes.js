const express = require("express");
const router = express.Router();
const {getCompanyScopeEmissions}  = require("../../controllers/adminDashboard/getCompanyScopeEmissions");


router.get("/companymonthlyscope-emission", getCompanyScopeEmissions);


module.exports = router;
