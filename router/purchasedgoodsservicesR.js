const express = require('express');
const router = express.Router();
const purchasedgoodsservicesController = require('../controllers/purchasedgoodsservicesController.js');

// POST: Create a new record
router.post('/add', purchasedgoodsservicesController.addpurchasedgoodsservices);

// GET: Retrieve all records
router.get('/get',purchasedgoodsservicesController.getpurchasedgoodsservices);

// GET: Retrieve a record by ID
router.get('/get/:id', purchasedgoodsservicesController.getpurchasedgoodsservicesById);

// PUT: Update a record by ID
router.put('/update/:id', purchasedgoodsservicesController.updatepurchasedgoodsservices);

// DELETE: Remove a record by ID
router.delete('/delete/:id',purchasedgoodsservicesController.deletepurchasedgoodsservices);

module.exports = router;
