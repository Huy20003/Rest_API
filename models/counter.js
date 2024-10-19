const mongoose = require("mongoose");
const { Schema } = mongoose;

// Kiểm tra và tạo mô hình Counter nếu chưa tồn tại
const Counter = mongoose.models.Counter || mongoose.model('Counter', new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}));

module.exports = Counter;