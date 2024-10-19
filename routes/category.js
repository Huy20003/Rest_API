const categoryController=require('../controller/categoryController');
const multer = require('multer');
const path = require('path');
const router=require("express").Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname)); // Tên file duy nhất dựa trên timestamp
    },
});

const upload = multer({ storage: storage });


router.post("/createCategory",upload.single('image'), categoryController.createCategory);

router.get("/getcategory",categoryController.getCategory);

router.patch("/updateCategory/:id",upload.single('image'), categoryController.updateCategory);

router.delete("/delete/:id",categoryController.deleteCategory);
module.exports=router;
