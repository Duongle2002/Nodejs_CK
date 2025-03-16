import express from 'express';
import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';
import Order from '../models/order.mjs';
import { isAuthenticated } from '../middlewares/auth.mjs';

const router = express.Router();

// Hàm tạo baseUrl dựa trên môi trường
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://' + req.get('host');
  }
  return req.protocol + '://' + req.get('host');
};

// Lấy giỏ hàng (giao diện HTML)
router.get('/cart', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.render('cart', { cart, user: req.user });
  } catch (error) {
    res.status(500).send('Lỗi khi tải giỏ hàng');
  }
});

// Lấy giỏ hàng (JSON API)
router.get('/api/cart', async (req, res) => {
  try {
    const userId = req.session.userId || 'guest';
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ items: [], subtotal: 0 });
    }

    const baseUrl = getBaseUrl(req);
    let subtotal = 0;
    const cartItems = cart.items.map(item => {
      if (!item.productId) {
        return null;
      }
      const itemTotal = item.productId.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image.match(/^https?:\/\//)
          ? item.productId.image
          : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
        total: itemTotal,
      };
    }).filter(item => item !== null);

    res.status(200).json({
      items: cartItems,
      subtotal: subtotal.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading cart', error: error.message });
  }
});

// Thêm vào giỏ hàng
router.post('/add-to-cart/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.session.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId: product._id, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId: product._id, quantity });
      }
    }
    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật số lượng
router.post('/update-quantity', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.userId || 'guest';

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid productId or quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
      let subtotal = 0;
      const cartItems = updatedCart.items.map(item => {
        const itemTotal = item.productId.price * item.quantity;
        subtotal += itemTotal;
        return {
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          image: item.productId.image.match(/^https?:\/\//)
            ? item.productId.image
            : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
          total: itemTotal,
        };
      });

      res.status(200).json({
        message: 'Quantity updated successfully',
        items: cartItems,
        subtotal: subtotal.toFixed(2),
      });
    } else {
      res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Xóa khỏi giỏ hàng
router.post('/remove-from-cart', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.userId || 'guest';

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const baseUrl = getBaseUrl(req);
    let subtotal = 0;
    const cartItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image.match(/^https?:\/\//)
          ? item.productId.image
          : `${baseUrl}/images/${item.productId.image.split('/').pop()}`,
        total: itemTotal,
      };
    });

    res.status(200).json({
      message: 'Product removed from cart',
      items: cartItems,
      subtotal: subtotal.toFixed(2),
      user: req.session.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});

// Đặt hàng
router.post('/place-order', isAuthenticated, async (req, res) => {
  try {
    const { address, phone } = req.body;
    const userId = req.session.userId;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalPrice = cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0);

    const order = new Order({
      userId,
      items: cart.items,
      address,
      phone,
      totalPrice,
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
