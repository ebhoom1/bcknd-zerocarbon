const express=require("express");
const {formSubmission,getUsersWithUserTypeUser}=require("../controllers/userController");
const router=express.Router();


router.post('/forms',formSubmission);
router.get('/getuser',getUsersWithUserTypeUser)




module.exports=router;