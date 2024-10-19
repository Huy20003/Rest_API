const restaurantController = require("../controller/restaurantController");

const path = require('path');
const multer = require('multer');
const router=require("express").Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name based on timestamp
    },
});

const upload = multer({ storage: storage });

router.post("/createRestaurant",upload.single('HinhAnh'),restaurantController.createRestaurant);

router.get("/getRestaurant",restaurantController.getRestaurant);

module.exports=router;
