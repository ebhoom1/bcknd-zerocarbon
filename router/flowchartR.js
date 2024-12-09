const express = require('express');
const { saveFlowchart, getFlowchart } = require('../controllers/flowchartController');
// const { authenticate } = require('../utils/authenticate');

const router = express.Router();

router.get('/get/:userId', getFlowchart); 
router.post('/save', saveFlowchart);

module.exports = router;
