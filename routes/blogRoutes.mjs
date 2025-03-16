//routes/blogRoutes.mjs
import express from 'express';
import { getBlogPage, getBlogDetail } from '../controllers/blogController.mjs';
const router = express.Router();

// Route cho trang Blog
router.get('/blog', (req, res) => {
  getBlogPage(req, res, { user: req.session.user });
});

// Route cho chi tiết blog
router.get('/blog/:id', (req, res) => {
  getBlogDetail(req, res, { user: req.session.user });
});

export default router;
