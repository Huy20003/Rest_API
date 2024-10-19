const Category= require("../models/category");
const multer = require('multer');
const path = require('path');



// Cấu hình multer

const categoryController={
    // createCategory: async (req, res) => {
    //     try {
    //       const { name, image } = req.body;
    //       if (!name || !image ) {
    //         return res.status(400).json({ err: 'All fields are required' });
    //       }
    //       const newCategory = await Category.create({ name, image });
    //       return res.status(201).json(newCategory);
    //     } catch (err) {
    //       return res.status(500).json({ err: err.message });
    //     }
    //   },


    createCategory: async (req, res) => {
        try {
          const { Name } = req.body;
          if (!Name || !req.file) {
            return res.status(400).json({ err: 'All fields are required' });
          }
          const image = req.file.path; // Đường dẫn file được lưu trữ
          const newCategory = new Category({ Name, image });
          await newCategory.save();
          return res.status(201).json(newCategory);
        } catch (err) {
          return res.status(500).json({ err: err.message });
        }
      },

      getCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            const baseUrl = `${req.protocol}://${req.get('host')}/`; // base URL của server
            const categoriesWithFullImagePath = categories.map(category => {
                return {
                    ...category._doc,
                    image: baseUrl + category.image.replace(/\\/g, '/') // Thay đổi backslashes thành slashes
                };
            });
            return res.status(200).json(categoriesWithFullImagePath);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    },

    updateCategory: async (req, res) => {
      const id = req.params.id;
      const { Name } = req.body;
      try {
          if (!Name) {
              return res.status(400).json({ err: 'Name is required' });
          }
          
          let updateData = { Name };
  
          if (req.file) {
              updateData.image = req.file.path;
          }
  
          const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
          if (!updatedCategory) {
              return res.status(404).json({ err: 'Category not found' });
          }
          return res.status(200).json(updatedCategory);
      } catch (err) {
          return res.status(500).json({ err: err.message });
      }
  },
  

    deleteCategory: async (req, res) => {
        const id = req.params.id;
        try {
            const deletedCategory = await Category.findByIdAndDelete(id);
            if (!deletedCategory) {
                return res.status(404).json({ err: 'Category not found' });
            }
            return res.status(200).json(deletedCategory);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    },

}
module.exports=categoryController;