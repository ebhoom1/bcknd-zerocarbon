const express = require('express');
const router = express.Router();
const IndustrialProcessController = require('../controllers/IndustrialProcessController');

router.post('/add', IndustrialProcessController.addIndustrialProcess);
router.get('/get', IndustrialProcessController.getAllIndustrialProcesses);
router.get('/get/:id', IndustrialProcessController.getIndustrialProcessById);
router.put('/update/:id', IndustrialProcessController.updateIndustrialProcess);
router.delete('/delete/:id', IndustrialProcessController.deleteIndustrialProcess);

module.exports = router;
