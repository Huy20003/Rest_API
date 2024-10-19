const mongoose = require('mongoose');
const Restaurant = require('./restaurant');

const orderItemSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        restaurant:{
            type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }]
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
