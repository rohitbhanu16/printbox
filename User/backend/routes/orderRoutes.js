const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Create a new order
router.post('/',orderController.createOrder);

// Get orders (current and history)
router.get('/', orderController.getOrders);

// Mark order as completed
router.put('/:id/complete', orderController.markOrderComplete);

// Mark order as urgent
router.put('/:id/urgent', orderController.markOrderUrgent);

// Cancel an order
router.delete('/:id/cancel', orderController.cancelOrder);

module.exports = router;
