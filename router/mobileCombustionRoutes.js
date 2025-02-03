const express = require('express');
const router = express.Router();
const MobileCombustionController = require('../controllers/MobileCombustionController');

router.post('/add', MobileCombustionController.addMobileCombustion);
router.get('/get', MobileCombustionController.getAllMobileCombustion);
router.get('/get/:id', MobileCombustionController.getMobileCombustionById);
router.put('/update/:id', MobileCombustionController.updateMobileCombustion);
router.delete('/delete/:id', MobileCombustionController.deleteMobileCombustion);

module.exports = router;
