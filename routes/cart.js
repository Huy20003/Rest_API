const cartController = require("../controller/cartController");
const path = require('path');
const multer = require('multer');
const router = require("express").Router();
const middlewareController = require("../middleware/middlewareController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name based on timestamp
    },
});


const upload = multer({ storage: storage });

// Route thêm sản phẩm vào giỏ hàng
router.post("/addCart", middlewareController.verifyToken, cartController.addCart);

// Route xóa sản phẩm khỏi giỏ hàng
router.delete("/removeCart", middlewareController.verifyToken, cartController.removeItem);

// Route đặt hàng
router.post("/order", middlewareController.verifyToken, cartController.placeOrder);

// Route lấy thông tin giỏ hàng hiện tại của người dùng
router.get("/getCart", middlewareController.verifyToken, cartController.getCart);

router.get("/getOderAdmin",cartController.getOrdersForAdmin);

// Route cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/updateCartItemQuantity", middlewareController.verifyToken, cartController.updateCartItemQuantity);

//getOderUser
router.get("/getOder",middlewareController.verifyToken,cartController.getUserOrders);

module.exports = router;
