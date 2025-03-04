const mongoose = require('mongoose');
const Order = require('../models/Order');
const Stationary = require('../models/Stationary');
const User = require("../models/User")
const {notifyUser, setupWebSocket} = require('../websocket')

//Get Orders for a stationary shop
exports.getOrders = async (req, res) => {
  try {
    console.log("Full request query:", req.query);

    const stationary = req.query.stationary ? req.query.stationary.trim() : null; 
    const { startDate, endDate, status } = req.query;

    console.log("Stationary ID from request:", stationary);

    if (!stationary) {
      return res.status(400).json({ error: 'Stationary ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(stationary)) {
      return res.status(400).json({ error: "Invalid Stationary ID format" });
    }

    console.log('Fetching orders for stationary:', stationary);

    let query = { stationary: new mongoose.Types.ObjectId(stationary) };

    // Apply Date Filter
    if(startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Aply status filter
    if (status) {
      query.status = status;
    }

    console.log("Fetching orders with filters:", query);

    const orders = await Order.find({ stationary: new mongoose.Types.ObjectId(stationary) })
  .populate("stationary", "shopName phone")
  .populate("user", "name"); 


    if (!orders.length) {
      return res.status(404).json({ error: 'No orders found for this stationary' });
    }

    console.log('Orders fetched successfully:', orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.markOrderReady = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: "ready" },
      { new: true }
    ).populate("user", "_id");  //Populate user ID

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.user || !order.user._id) {
      return res.status(400).json({ error: "User information is missing from order" });
    }

    console.log(`Order ${order._id} is ready. Notifying user ${order.user._id}`);

    //Ensure user._id is converted to string before using notifyUser
    notifyUser(order.user._id.toString(), "orderReady", order);

    res.status(200).json({ message: "Order marked as ready", order });
  } catch (error) {
    console.error("Error marking order as ready:", error);
    res.status(500).json({ error: error.message });
  }
};
