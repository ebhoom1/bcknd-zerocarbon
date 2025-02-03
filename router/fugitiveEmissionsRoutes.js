const express = require('express');
const router = express.Router();
const FugitiveEmissionsController = require('../controllers/FugitiveEmissionsController');

router.post('/add', FugitiveEmissionsController.addFugitiveEmissions);
router.get('/get', FugitiveEmissionsController.getAllFugitiveEmissions);
router.get('/get/:id', FugitiveEmissionsController.getFugitiveEmissionsById);
router.put('/update/:id', FugitiveEmissionsController.updateFugitiveEmissions);
router.delete('/delete/:id', FugitiveEmissionsController.deleteFugitiveEmissions);

module.exports = router;
