const express=require("express");
const {registerUser,registerConsultantUser,login,updatePassword}=require("../controllers/userController");
const {forgotPassword}=require("../controllers/forgotpassword");
const router=express.Router();

router.post('/register',registerUser);
router.post('/consultant/registeruser',registerConsultantUser);
router.post('/login',login);
router.put("/update-password/:userId", updatePassword);
router.post('/forgotpassword',forgotPassword);

module.exports=router;