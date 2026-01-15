import mongoose from 'mongoose';

const ticketCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0, // store in smallest unit (paise)
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TicketCategory = mongoose.model('TicketCategory', ticketCategorySchema);
