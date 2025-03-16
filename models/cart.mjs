import mongoose from 'mongoose';
import { productDBConnection } from '../config/connectDB.mjs';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
  // address: {
  //   type: String,
  //   required: false,
  // },
  // phone: {
  //   type: String,
  //   required: false,
  // },
});

const Cart = productDBConnection.model('Cart', cartSchema);

export default Cart;
