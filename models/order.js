const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    MaKH: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', required: true }],
    totalItems: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now },
    status: { type: String, required: true, default: 'Pending' },
    paymentMethod: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;