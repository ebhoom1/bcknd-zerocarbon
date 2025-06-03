const express=require("express");
const {registerUser,login,updatePassword,updateUserProfile}=require("../controllers/userController");
const {forgotPassword}=require("../controllers/forgotpassword");
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.put("/update/:id", updateUserProfile);
router.put("/update-password/:userId", updatePassword);
router.post('/forgotpassword',forgotPassword);

module.exports=router;