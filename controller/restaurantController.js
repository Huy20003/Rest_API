const Restaurant= require("../models/restaurant");
const multer = require('multer');
const path = require('path');

const restaurantContrller={
    createRestaurant: async (req, res) => {
        try {
            const { name,DiaChi } = req.body;
            if (!name || !DiaChi ||  !req.file) {
              return res.status(400).json({ err: 'All fields are required' });
            }
            const HinhAnh = req.file.path; // Đường dẫn file được lưu trữ
            const newRestaurant  = new Restaurant({ name, DiaChi, HinhAnh });
            await newRestaurant.save();
            return res.status(201).json(newRestaurant);
          } catch (err) {
            return res.status(500).json({ err: err.message });
          }
        },
  

    getRestaurant:async(req,res)=>{
        try {
            const restaurant = await Restaurant.find();
            const baseUrl = `${req.protocol}://${req.get('host')}/`; // base URL của server
            const restaurantWithFullImagePath = restaurant.map(restaurant => {
                return {
                    ...restaurant._doc,
                    HinhAnh: baseUrl + restaurant.HinhAnh.replace(/\\/g, '/') // Thay đổi backslashes thành slashes
                };
            });
            return res.status(200).json(restaurantWithFullImagePath);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    },


}

module.exports=restaurantContrller;

