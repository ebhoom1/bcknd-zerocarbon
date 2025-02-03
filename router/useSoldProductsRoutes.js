const express = require('express');
const router = express.Router();
const UseSoldProductsController = require('../controllers/useSoldProductsController');

// POST: Create a new record
router.post('/add', UseSoldProductsController.addUseSoldProduct);

// GET: Retrieve all records
router.get('/get', UseSoldProductsController.getAllUseSoldProducts);

// GET: Retrieve a single record by ID
router.get('/get/:id', UseSoldProductsController.getUseSoldProductById);

// PUT: Update a record by ID
router.put('/update/:id', UseSoldProductsController.updateUseSoldProduct);

// DELETE: Remove a record by ID
router.delete('/delete/:id', UseSoldProductsController.deleteUseSoldProduct);

module.exports = router;
