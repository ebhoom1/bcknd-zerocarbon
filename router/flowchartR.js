
const express = require('express');
const { saveFlowchart, getFlowchart,updateFlowchartAdmin ,deleteFlowchartAdmin} = require('../controllers/flowchartController');
const { authenticate } = require('../utils/authenticate');

const router = express.Router();


router.delete('/admin/delete',deleteFlowchartAdmin); 
router.patch('/admin/update',updateFlowchartAdmin);
router.get('/get/:userId',getFlowchart); 
router.post('/save',saveFlowchart);

module.exports = router;
 