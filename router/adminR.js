const express=require("express");
const router=express.Router();
const authMiddleware=require('../utils/authenticate')
const {leadsStatus,getRegisteredUsers,getFormById,updateUserSubscription,getDashboardMatrics,getFormByFilter,getStatusCompleted,updateUser, deleteUser}=require("../controllers/adminController")

router.get('/registeredusers',authMiddleware,getRegisteredUsers);
router.patch('/registeredusers/status/:id',leadsStatus)
router.patch("/registeredusers/subscription/:id", updateUserSubscription);
router.get('/forms/filter',getFormByFilter);
router.get('/formDetails/:id',getFormById);
router.get("/dashboard-metrics",getDashboardMatrics);
router.get("/users",getStatusCompleted);
// Update user
router.put("/update-user/:id", authMiddleware, updateUser);
// Delete user
router.delete("/delete-user/:id", authMiddleware, deleteUser);

module.exports=router;