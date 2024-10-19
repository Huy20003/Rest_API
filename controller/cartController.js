const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/oderItems");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

const cartController = {
    addCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                cart = new Cart({ user: userId, items: [], totalPrice: 0 });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại" });
            }

            const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (cartItemIndex > -1) {
                cart.items[cartItemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart.totalPrice = await calculateTotalPrice(cart.items);
            await cart.save();
            await cart.populate('items.product');

            res.status(200).json({ message: "Đã thêm sản phẩm vào giỏ hàng", cart });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    removeItem: async (req, res) => {
        try {
            const { productId } = req.query; // Lấy productId từ query parameters
            const userId = req.user.id;

            let cart = await Cart.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
            }

            const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (cartItemIndex > -1) {
                cart.items.splice(cartItemIndex, 1);
                cart.totalPrice = await calculateTotalPrice(cart.items);
                await cart.save();
                await cart.populate('items.product');

                res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart });
            } else {
                res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
            }
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    placeOrder: async (req, res) => {
        try {
            const { address, paymentMethod } = req.body;
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }

            let cart = await Cart.findOne({ user: userId }).populate({
                path: 'items.product',
                populate: {
                    path: 'restaurant_id',
                    model: 'Restaurant'
                }
            });
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({ message: "Giỏ hàng trống hoặc không tồn tại" });
            }

            let totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

            let order = new Order({
                user: userId,
                MaKH: user.MaKH,
                totalItems: totalItems,
                totalPrice: cart.totalPrice,
                address: address,
                orderedAt: new Date(),
                status: 'Đang giao',
                paymentMethod: paymentMethod
            });

            order = await order.save();

            let products = cart.items.map(item => ({
                product: item.product._id,

               restaurant: item.product.restaurant_id._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const orderItem = new OrderItem({
                order: order._id,
                products: products
            });

            await orderItem.save();
            order.items.push(orderItem._id);
            await order.save();

            await Cart.findOneAndDelete({ user: userId });

            // Populate để lấy thông tin chi tiết của các sản phẩm trong đơn hàng
            const populatedOrder = await Order.findById(order._id).populate({
                path: 'items',
                populate: {
                    path: 'products.product',
                    model: 'Product',
                    populate: {
                        path: 'restaurant_id',
                        model: 'Restaurant'                             
                    }
                }
            });

            return res.status(200).json(populatedOrder);
        } catch (error) {
            console.error('Error placing order:', error); // Log the detailed error
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getCart: async (req, res) => {
        try {
            const userId = req.user.id;
            let cart = await Cart.findOne({ user: userId }).populate('items.product');

            if (!cart || cart.items.length === 0) {
                // Trả về giỏ hàng rỗng nếu giỏ hàng không tồn tại hoặc giỏ hàng tồn tại nhưng rỗng
                return res.status(200).json({ cart: [] });
            }

            const baseUrl = `${req.protocol}://${req.get('host')}/`;
            const itemsWithImages = cart.items.map(item => {
                const productImage = item.product.img ? baseUrl + item.product.img.replace(/\\/g, '/') : `${baseUrl}default-product-image.jpg`;

                return {
                    _id: item._id,
                    quantity: item.quantity,
                    product: {
                        _id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.product.quantity,
                        img: productImage,
                        size: item.product.Size,
                        category_id: item.product.category_id,

                    },
                };
            });

            return res.status(200).json({ itemsWithImages });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateCartItemQuantity: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Log thông tin đầu vào
            console.log(`Received request to update product ${productId} to quantity ${quantity} for user ${userId}`);

            if (quantity <= 0) {
                return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
            }

            // Tìm giỏ hàng của người dùng
            let cart = await Cart.findOne({ user: userId });

            // Log giỏ hàng
            console.log('Cart found:', JSON.stringify(cart, null, 2));

            if (!cart) {
                return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
            }

            const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            // Log chỉ mục sản phẩm trong giỏ hàng
            console.log(`Cart item index: ${cartItemIndex}`);

            if (cartItemIndex > -1) {
                if (quantity <= 0) {
                    cart.items.splice(cartItemIndex, 1);
                } else {
                    cart.items[cartItemIndex].quantity = quantity;
                }
                cart.totalPrice = await calculateTotalPrice(cart.items);
                await cart.save();
                await cart.populate('items.product');

                // Log giỏ hàng sau khi cập nhật
                console.log('Updated cart:', JSON.stringify(cart, null, 2));

                res.status(200).json({ message: "Đã cập nhật số lượng sản phẩm", cart });
            } else {
                res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    getUserOrders: async (req, res) => {
        try {
            const userId = req.user.id;
    
            // Tìm tất cả các đơn hàng của người dùng
            const orders = await Order.find({ user: userId })
            .populate({
                path: 'items',
                populate: [
                    {
                        path: 'products.product',
                        model: 'Product',
                        select: '_id name price ' // Thêm trường quantity
                    },
                    {
                        path: 'products.restaurant',
                        model: 'Restaurant',
                        select: '_id name'
                    }
                ]
            })
            .lean();
    
            // Kiểm tra nếu người dùng không có đơn hàng nào
            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "Không có đơn hàng nào" });
            }
    
            // Trả về danh sách các đơn hàng của người dùng
            return res.status(200).json({ orders });
        } catch (error) {
            console.error('Error getting user orders:', error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getOrdersForAdmin: async (req, res) => {
        try {
            // Fetch all orders and populate necessary fields
            const orders = await Order.find()
                .populate({
                    path: 'items',
                    populate: [
                        {
                            path: 'products.product',
                            model: 'Product',
                            select: '_id name price' // Add fields to select
                        },
                        {
                            path: 'products.restaurant',
                            model: 'Restaurant',
                            select: '_id name'
                        }
                    ]
                })
                .lean();

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: 'No orders found' });
            }

            return res.status(200).json({ orders });
        } catch (error) {
            console.error('Error getting all orders for admin:', error);
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

async function calculateTotalPrice(items) {
    let total = 0;
    for (let item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += item.quantity * product.price;
        }
    }
    return total;
}

module.exports = cartController;
