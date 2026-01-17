import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Order } from '../models/order.models.js';
import redisClient from '../configs/redis.config.js';
import { generateTickets } from '../service/ticket.service.js';
import crypto from 'crypto';

const createPayementIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order is not payable');
  }

  const existingIntent = await redisClient.get(`payment:${orderId}`);

  if (existingIntent) {
    return res
      .status(202)
      .json(new ApiResponse(202, JSON.parse(existingIntent), 'Payement intent already exists'));
  }

  const paymentIntent = {
    paymentId: crypto.randomUUID(),
    amount: order.amount,
    currency: 'INR',
    status: 'CREATED',
  };

  await redisClient.set(`payment:${orderId}`, JSON.stringify(paymentIntent), { EX: 900 });

  return res.status(201).json(new ApiResponse(201, paymentIntent, 'Payment intent created'));
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const cachedPayment = await redisClient.get(`payment:${orderId}`);
  if (!cachedPayment) {
    throw new ApiError(400, 'Payment session expired');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.status === 'PAID') {
    return res.status(200).json(new ApiResponse(200, order, 'Order already confirmed'));
  }

  order.status = 'PAID';
  await order.save();

  const tickets = await generateTickets({
    userId: order.user,
    eventId: order.event,
    orderId: order._id,
    categoryId: order.category,
    quantity: order.quantity,
  });

  await redisClient.del(`payment:${orderId}`);

  return res
    .status(200)
    .json(new ApiResponse(200, { order, tickets }, 'Payment successful, tickets generated'));
});

export { createPayementIntent, confirmPayment };
