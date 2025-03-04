const mongoose = require('mongoose');
const Order = require('../models/Order');
const { notifyStationary, getIO } = require('../websocket');

const createOrder = async (req, res) => {
  try {
    console.log('Received order payload:', JSON.stringify(req.body, null, 2));

    const { userId, stationaryId, documents, preferences, notes } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('❌ Invalid userId:', userId);
      return res.status(400).json({ error: 'Invalid userId format' });
    }
    if (!stationaryId || !mongoose.Types.ObjectId.isValid(stationaryId)) {
      console.error('❌ Invalid stationaryId:', stationaryId);
      return res.status(400).json({ error: 'Invalid stationaryId format' });
    }
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'At least one document is required.' });
    }

    console.log('✅ Validation passed. Creating order...');

    const newOrder = await Order.create({
      user: userId,
      stationary: stationaryId,
      documents,
      preferences,
      notes,
      status: 'pending',
      createdAt: new Date(),
    });

    console.log('✅ Order created successfully:', newOrder);

    const ioInstance = getIO();
    // ✅ Log clients in room before notifying
    const clients = ioInstance.sockets.adapter.rooms.get(stationaryId);
    console.log(`👀 Checking clients in room ${stationaryId}:`, clients ? [...clients] : "No clients");

    notifyStationary(stationaryId, "orderNotification", newOrder);

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get orders (current and history)
const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Fetch orders for the specific user
    const orders = await Order.find({ user: userId })
      .populate('stationary')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark order as completed
const markOrderComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'ready' },
      { new: true }
    ).populate('user');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    notifyUser(updatedOrder.user.toString(), 'orderReady', {
      message: 'Your order is Ready!',
      orderId: updatedOrder._id,
    });

    res.status(200).json(updatedOrder);

    res.status(200).json({ message: "Order marked as ready" });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error marking order as completed:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mark an order as urgent
const markOrderUrgent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 'preferences.urgency': 'urgent' },
      { new: true }
    ).populate('stationary');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    notifyUser(updatedOrder.user.toString(), 'orderMarkedUrgent', {
      message: `Your order with ID ${updatedOrder._id} has been marked as urgent.`,
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error marking order as urgent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id).populate('stationary');
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    notifyUser(deletedOrder.user.toString(), 'orderCancelled', {
      message: `Your order with ID ${deletedOrder._id} has been canceled.`,
    });

    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  markOrderComplete,
  markOrderUrgent,
  cancelOrder,
};
