const mongoose= require("mongoose");

const CategorySchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    image: { type: String, required: true },
}
, { timestamps: true });


const Category =mongoose.model("Category",CategorySchema);

module.exports= Category;