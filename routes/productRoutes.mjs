import express from 'express';
import { getProductDetail, getProductPage } from '../controllers/productController.mjs';
import Product from '../models/product.mjs';
import { isAuthenticated } from "../middlewares/auth.mjs";

const router = express.Router();

router.get('/product', (req, res) => {
  getProductPage(req, res, { user: req.session.user });
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});
router.get('/admin/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
  }
});

router.get('/single_product/:id', (req, res) => {
  getProductDetail(req, res, { user: req.session.user });
});

router.post('/add', async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = new Product({ name, price, description, image });
    await product.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error adding product');
  }
});

export default router;
