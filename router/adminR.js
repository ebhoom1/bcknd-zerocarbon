const express=require("express");
const router=express.Router();
const {leadsStatus,getregisteredusers,getFormById,getDashboardMatrics,getFormByFilter,getStatusCompleted}=require("../controllers/adminController")

router.get('/registeredusers',getregisteredusers);
router.patch('/registeredusers/status/:id',leadsStatus)
router.get('/forms/filter',getFormByFilter);
router.get('/formDetails/:id',getFormById);
router.get("/dashboard-metrics",getDashboardMatrics);
router.get("/completed",getStatusCompleted)


module.exports=router;