import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketCategory',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'USED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },

    checkedInAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

export default mongoose.model('Ticket', ticketSchema);
