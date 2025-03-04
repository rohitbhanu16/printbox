const express = require('express');
const stationaryController = require('../controllers/stationaryController');
const router = express.Router();

// Create a stationary shop
router.post('/', stationaryController.createStationary);

// Delete a stationary shop
router.delete('/:id', stationaryController.deleteStationary);

// Get all stationary shops
router.get('/', stationaryController.getAllStationary);

// Get a specific stationary shop by ID
router.get('/:id', stationaryController.getStationaryById);


module.exports = router;
