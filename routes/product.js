const productController = require("../controller/productController");
const product= require("../controller/productController");
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

router.post("/createProduct",upload.single('img'),productController.createProduct);

router.get("/getProduct",productController.getProduct);

router.patch("/updateProdcut/:id",productController.updateProduct);

router.delete("/deleteProduct/:id",productController.deleteProduct);
module.exports=router;