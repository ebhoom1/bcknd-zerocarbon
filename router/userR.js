const express=require("express");
const {formSubmission,getBoundariesScope,createBoundaryScope, postProcessFlowChart, getProcessFlowChart, deleteNode, deleteEdge}=require("../controllers/userController");
const router=express.Router();


router.post('/forms',formSubmission);
router.get('/getBoundariesScope',getBoundariesScope);
router.post('/createBoundaryScope',createBoundaryScope);
router.post('/processFlow',postProcessFlowChart);
router.get('/processFlow',getProcessFlowChart);
router.delete('/delete-node',deleteNode);
router.delete('/delete-edge',deleteEdge);
module.exports=router;