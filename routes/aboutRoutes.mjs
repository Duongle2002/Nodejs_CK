import express from 'express';

const router = express.Router();

// Route cho trang About
router.get('/about', (req, res) => {
  res.render('about', { user: req.session.user });
});

export default router;
