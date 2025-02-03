const express = require('express');
const router = express.Router();
const EndOfLifeTreatmentController = require('../controllers/EndOfLifeTreatmentController');

// POST: Create a new record
router.post('/add', EndOfLifeTreatmentController.addEndOfLifeTreatment);

// GET: Retrieve all records
router.get('/get', EndOfLifeTreatmentController.getAllEndOfLifeTreatments);

// GET: Retrieve a single record by ID
router.get('/get/:id', EndOfLifeTreatmentController.getEndOfLifeTreatmentById);

// PUT: Update a record by ID
router.put('/update/:id', EndOfLifeTreatmentController.updateEndOfLifeTreatment);

// DELETE: Remove a record by ID
router.delete('/delete/:id', EndOfLifeTreatmentController.deleteEndOfLifeTreatment);

module.exports = router;
