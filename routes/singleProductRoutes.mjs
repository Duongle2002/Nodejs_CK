import express from 'express';
import { getSingleProductPage } from '../controllers/singleProductController.mjs';

const router = express.Router();

router.get('/single_product', (req, res) => {
  getSingleProductPage(req, res, { user: req.session.user });
});

export default router;
