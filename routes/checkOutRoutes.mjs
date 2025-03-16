import express from 'express';
import { checkOutPage } from '../controllers/checkOutController.mjs';
import { isAuthenticated } from '../middlewares/auth.mjs';

const router = express.Router();

// Route for checkout page
router.get('/checkout', isAuthenticated, (req, res) => {
  checkOutPage(req, res, { user: req.session.user });
});

// Route to delete checkout order
router.delete('/:id', async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);
    if (!checkout) {
      return res.status(404).send('Checkout order not found');
    }
    res.send('Checkout order deleted');
  } catch (error) {
    res.status(500).send('Error deleting checkout order');
  }
});

export default router;
