const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    DiaChi: {
        type: String,
        required: true

    },
    HinhAnh: {
        type: String,
        required: true
    },
},{ timestamps: true });



const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;