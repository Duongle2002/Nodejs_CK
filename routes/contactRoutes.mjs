import express from 'express';
import { contactPage, submitMessage } from '../controllers/contactController.mjs';

const router = express.Router();

// Route cho trang liên hệ
router.get('/contact', (req, res) => {
  contactPage(req, res, { user: req.session.user});
});
router.post('/contact/submit', (req, res) => {
  submitMessage(req, res, { user: req.session.user });
});

export default router;
