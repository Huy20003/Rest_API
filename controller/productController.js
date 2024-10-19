const Product = require("../models/product");


const productController = {
    createProduct: async (req, res) => {
        try {
            const body = req.body;
            if (req.file) {
                body.img = req.file.path; // Save the path of the uploaded image
            }
            const newProduct = await Product.create(body);
            return res.status(201).json(newProduct);
        } catch (err) {
            return res.status(500).json({ err: err.message });
        }
    },

    // getProduct: async (req, res) => {
    //     try {
    //         const category_id = req.query.category_id;
    //         body_query = {}
    //         if (category_id)
    //             body_query.category_id = category_id;
    //         const product = await Product.find(category_id);
    //         return res.status(200).json(product)

    //     } catch (err) {
    //         console.err('Không tìm thấy sản phẩm', err);
    //         return res.status(500).json({ err: err.message })


    //     }

    // },
    // getProduct: async (req, res) => {
    //     try {
    //       const category_id = req.query.category_id?.trim(); // Chaining tùy chọn để xử lý category_id không xác định
    //       const query = category_id ? { category_id } : {}; // Xây dựng truy vấn dựa trên category_id
      
    //       const product = await Product.find(query);
    //       if (!product) {
    //         return res.status(404).json({ message: 'Sản phẩm không được tìm thấy' });
    //       }
      
    //       return res.status(200).json(product);
    //     } catch (err) {
    //       console.error('Lỗi khi lấy sản phẩm:', err);
    //       return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
    //     }
    //   },
    // getProduct: async (req, res) => {
    //     try {
    //         const category_id = req.query.category_id?.trim(); // Lấy category_id từ query params
    //         let query = {};

    //         if (category_id) {
    //             query = { category_id }; // Nếu có category_id, chỉ lấy sản phẩm của category đó
    //         }

    //         // Lấy danh sách sản phẩm với thông tin cơ bản
    //         const products = await Product.find(query, 'name price quantity img Size category_id');

            

    //         if (!products || products.length === 0) {
    //             return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    //         }

    //         // Chuẩn bị baseUrl để xây dựng đường dẫn đầy đủ của ảnh
    //         const baseUrl = `${req.protocol}://${req.get('host')}/`;

    //         // Chuyển đổi các sản phẩm để bổ sung thông tin về ảnh sản phẩm và danh mục
    //         const productsWithImages = products.map(product => {
    //             const categoryImage = product.category_id?.image ? baseUrl + product.category_id.image.replace(/\\/g, '/') : null;
    //             const productImage = product.img ? baseUrl + product.img.replace(/\\/g, '/') : null;
                
    //             return {
    //                 ...product._doc,
    //                 category: {
    //                     _id: product.category_id._id,
    //                     Name: product.category_id.Name,
    //                     image: categoryImage || `${baseUrl}/default-category-image.jpg` // Sử dụng ảnh mặc định nếu không có ảnh danh mục
    //                 },
    //                 img: productImage // Bổ sung đường dẫn đầy đủ của ảnh sản phẩm (nếu tồn tại)
    //             };
    //         });

    //         return res.status(200).json(productsWithImages);
    //     } catch (err) {
    //         console.error('Lỗi khi lấy sản phẩm:', err);
    //         return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
    //     }
    // },

      getProduct :async (req, res) => {
        try {
            const categoryId = req.query.category_id?.trim();
            const restaurantId = req.query.restaurant_id?.trim();
            let query = {};
    
            if (categoryId) {
                query.category_id = categoryId;
            }
    
            if (restaurantId) {
                query.restaurant_id = restaurantId;
            }
    
    
            const products = await Product.find(query, 'name price quantity img Size category_id').populate('category_id', 'Name image').populate('restaurant_id', 'name DiaChi image');;
    
            if (!products || products.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
    
            const baseUrl = `${req.protocol}://${req.get('host')}/`;
    
            const productsWithImages = products.map(product => {
                const categoryImage = product.category_id?.image ? baseUrl + product.category_id.image.replace(/\\/g, '/') : `${baseUrl}/default-category-image.jpg`;
                const restaurantImage=product.restaurant_id?.HinhAnh ? baseUrl + product.restaurant_id.HinhAnh.replace(/\\/g, '/') : `${baseUrl}/default-restaurant-image.jpg`;
                const productImage = product.img ? baseUrl + product.img.replace(/\\/g, '/') : `${baseUrl}/default-product-image.jpg`;
    
                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    img: productImage,
                    size: product.Size,
                    category: {
                        _id: product.category_id._id,
                        name: product.category_id.Name,
                        image: categoryImage
                    },
                    restaurant: {
                        _id: product.restaurant_id._id,
                        name: product.restaurant_id.name,
                        DiaChi: product.restaurant_id.DiaChi,
                        HinhAnh: restaurantImage
                    }
                };
            });
    
            return res.status(200).json(productsWithImages);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm:', err);
            return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
        }
    },

    updateProduct:async(req,res)=>{
        const id=req.params.id;
        const body=req.body;
        const update=await Product.findByIdAndUpdate(id,body,{new: true});
        return res.status(201).json(update);

    },

    deleteProduct:async(req,res)=>{
        const id=req.params.id;
        const deleteP=await Product.findByIdAndDelete(id);
        return res.status(200).json(deleteP);

    }


}

module.exports = productController; 