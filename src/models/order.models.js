import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },

    quantity:{
      type:Number,
      required: true,
      min:1,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },

    paymentRef: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

export const Order = mongoose.model('Order', orderSchema);
