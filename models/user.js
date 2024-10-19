const mongoose= require("mongoose");
const { Schema } = mongoose;


const Counter = require("./counter");


const UserSchema = new mongoose.Schema({
    MaKH: {
      type: String,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  });
  
  // Middleware để tự động tạo MaKH trước khi lưu tài liệu mới
  UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isNew) {
      try {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'customerId' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        user.MaKH = `KH${counter.seq.toString().padStart(5, '0')}`;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  });
  
  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  
  module.exports = User;
  