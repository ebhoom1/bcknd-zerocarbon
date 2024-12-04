const express=require("express");
const router=express.Router();
const {getForm,getFormById,getDashboardMatrics,getFormByFilter}=require("../controllers/adminController")

router.get('/forms',getForm);
router.get('/forms/filter',getFormByFilter);
router.get('/formDetails/:id',getFormById);
router.get("/dashboard-metrics",getDashboardMatrics);

module.exports=router;