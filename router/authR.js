const express=require("express");
const {registerUser,login,updatePassword}=require("../controllers/userController");
const {forgotPassword}=require("../controllers/forgotpassword");
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.put("/update-password/:userId", updatePassword);
router.post('/forgotpassword',forgotPassword);

module.exports=router;