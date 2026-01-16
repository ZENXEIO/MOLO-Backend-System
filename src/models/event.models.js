import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    venue: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
      default: 'DRAFT',
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

export const Event = mongoose.model('Event', eventSchema);
