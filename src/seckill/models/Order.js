const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
