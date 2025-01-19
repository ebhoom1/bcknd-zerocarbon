const express=require("express");
const {registerUser,login,}=require("../controllers/userController");
const {forgotPassword}=require("../controllers/forgotpassword");
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.post('/forgotpassword',forgotPassword);

module.exports=router;