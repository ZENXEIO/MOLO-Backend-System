import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { TicketCategory } from '../models/ticketcat.models.js';
import { Order } from '../models/order.models.js';

const createOrder = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { quantity } = req.body;

  if (!categoryId || !quantity || quantity <= 0) {
    throw new ApiError(400, 'Invalid request data');
  }

  const category = await TicketCategory.findOneAndUpdate(
    {
      _id: categoryId,
      availableSeats: { $gte: quantity },
    },

    {
      $inc: { availableSeats: -quantity },
    },
    { new: true },
  );

  if (!category) {
    throw new ApiError(401, 'Not enough seats');
  }

  const order = await Order.create({
    user: req.user._id,
    event: category.event,
    amount: category.price * quantity,
    quantity,
    status: 'PENDING',
  });

  return res.status(201).json(new ApiResponse(201, order, 'Order has been created'));
});

const getmyorder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id }).populate('event').sort({ createdAt: -1 });

  return res.status(201).json(new ApiResponse(201, order, 'orders fetched successfully'));
});
export { createOrder, getmyorder };
