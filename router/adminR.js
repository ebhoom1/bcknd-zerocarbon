const express=require("express");
const router=express.Router();
const {leadsStatus,getForm,getFormById,getDashboardMatrics,getFormByFilter,getStatusCompleted}=require("../controllers/adminController")

router.get('/forms',getForm);
router.patch('/forms/status/:id',leadsStatus)
router.get('/forms/filter',getFormByFilter);
router.get('/formDetails/:id',getFormById);
router.get("/dashboard-metrics",getDashboardMatrics);
router.get("/completed",getStatusCompleted)


module.exports=router;