const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    MaSP: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        requried: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    Size: {
        type: String,
        required: true

    },
    category_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category"
    },
    restaurant_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Restaurant"

    }

});
ProductSchema.pre('save', async function (next) {
    const product = this;
    if (product.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'productId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            product.MaSP = `SP${counter.seq.toString().padStart(5, '0')}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

module.exports = Product;