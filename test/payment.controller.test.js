import { jest } from '@jest/globals';

let createPayementIntent;
let confirmPayment;
let Order;
let ApiError;
let ApiResponse;
let redisClient;
let mongoose;

beforeAll(async () => {
  const ctrl = await import('../src/controllers/payment.controller.js');
  createPayementIntent = ctrl.createPayementIntent;
  confirmPayment = ctrl.confirmPayment;

  const orderMod = await import('../src/models/order.models.js');
  Order = orderMod.Order;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;

  const respMod = await import('../src/utils/ApiResponse.js');
  ApiResponse = respMod.ApiResponse;

  const redisMod = await import('../src/configs/redis.config.js');
  redisClient = redisMod.default;

  const mongooseMod = await import('mongoose');
  mongoose = mongooseMod.default;
}, 30000);

afterAll(async () => {
  // Disconnect Redis
  if (redisClient && typeof redisClient.disconnect === 'function') {
    try {
      await redisClient.disconnect();
    } catch (err) {
      console.log('Error disconnecting Redis:', err.message);
    }
  }

  // Disconnect MongoDB
  if (mongoose && typeof mongoose.disconnect === 'function') {
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.log('Error disconnecting MongoDB:', err.message);
    }
  }
});

describe('createPayementIntent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('creates payment intent successfully for valid order', async () => {
    const mockOrder = {
      _id: 'order123',
      amount: 1000,
      status: 'PENDING',
    };

    jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
    jest.spyOn(redisClient, 'get').mockResolvedValue(null);
    jest.spyOn(redisClient, 'set').mockResolvedValue('OK');

    const req = {
      params: { orderId: 'order123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createPayementIntent(req, res, next);

    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(redisClient.get).toHaveBeenCalledWith('payment:order123');
    expect(redisClient.set).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();

    const responseArg = res.json.mock.calls[0][0];
    expect(responseArg.statusCode).toBe(201);
    expect(responseArg.data.amount).toBe(1000);
    expect(responseArg.data.currency).toBe('INR');
    expect(responseArg.data.status).toBe('CREATED');
    expect(responseArg.data.paymentId).toBeDefined();

    expect(next).not.toHaveBeenCalled();
  }, 10000);

  test('returns existing payment intent if already created', async () => {
    const mockOrder = {
      _id: 'order123',
      amount: 1000,
      status: 'PENDING',
    };

    const existingIntent = {
      paymentId: 'existing-uuid',
      amount: 1000,
      currency: 'INR',
      status: 'CREATED',
    };

    jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
    jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(existingIntent));

    const req = {
      params: { orderId: 'order123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createPayementIntent(req, res, next);

    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(redisClient.get).toHaveBeenCalledWith('payment:order123');

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalled();

    const responseArg = res.json.mock.calls[0][0];
    expect(responseArg.statusCode).toBe(202);
    expect(responseArg.data.paymentId).toBe('existing-uuid');
    expect(responseArg.message).toBe('Payement intent already exists');
  }, 10000);

  test('throws error when order does not exist', async () => {
    jest.spyOn(Order, 'findById').mockResolvedValue(null);

    const req = {
      params: { orderId: 'nonexistent123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createPayementIntent(req, res, next);

    expect(Order.findById).toHaveBeenCalledWith('nonexistent123');
    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Order is not payable');
  }, 10000);

  test('throws error when orderId is missing', async () => {
    jest.spyOn(Order, 'findById').mockResolvedValue(null);

    const req = {
      params: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createPayementIntent(req, res, next);

    expect(Order.findById).toHaveBeenCalledWith(undefined);
    expect(next).toHaveBeenCalled();
  }, 10000);
});

describe('confirmPayment', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('confirms payment successfully with valid session', async () => {
    const cachedPayment = {
      paymentId: 'uuid-123',
      amount: 1000,
      currency: 'INR',
      status: 'CREATED',
    };

    const mockOrder = {
      _id: 'order123',
      user: 'user123',
      amount: 1000,
      status: 'PENDING',
      save: jest.fn().mockResolvedValue({
        _id: 'order123',
        user: 'user123',
        amount: 1000,
        status: 'PAID',
      }),
    };

    jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(cachedPayment));
    jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
    jest.spyOn(redisClient, 'del').mockResolvedValue(1);

    const req = {
      params: { orderId: 'order123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await confirmPayment(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith('payment:order123');
    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(mockOrder.save).toHaveBeenCalled();
    expect(redisClient.del).toHaveBeenCalledWith('payment:order123');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const responseArg = res.json.mock.calls[0][0];
    expect(responseArg.statusCode).toBe(200);
    expect(responseArg.message).toBe('Payment successful, tickets generated');

    expect(next).not.toHaveBeenCalled();
  }, 10000);

  test('throws error when payment session is expired', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue(null);

    const req = {
      params: { orderId: 'order123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await confirmPayment(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith('payment:order123');
    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Payment session expired');
  }, 10000);

  test('throws error when order not found during confirmation', async () => {
    const cachedPayment = {
      paymentId: 'uuid-123',
      amount: 1000,
      currency: 'INR',
      status: 'CREATED',
    };

    jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(cachedPayment));
    jest.spyOn(Order, 'findById').mockResolvedValue(null);

    const req = {
      params: { orderId: 'nonexistent123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await confirmPayment(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith('payment:nonexistent123');
    expect(Order.findById).toHaveBeenCalledWith('nonexistent123');
    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Order not found');
  }, 10000);

  test('cleans up redis cache after successful payment confirmation', async () => {
    const cachedPayment = {
      paymentId: 'uuid-123',
      amount: 1000,
      currency: 'INR',
      status: 'CREATED',
    };

    const mockOrder = {
      _id: 'order123',
      user: 'user123',
      amount: 1000,
      status: 'PENDING',
      save: jest.fn().mockResolvedValue({
        _id: 'order123',
        status: 'PAID',
      }),
    };

    jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(cachedPayment));
    jest.spyOn(Order, 'findById').mockResolvedValue(mockOrder);
    jest.spyOn(redisClient, 'del').mockResolvedValue(1);

    const req = {
      params: { orderId: 'order123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await confirmPayment(req, res, next);

    expect(redisClient.del).toHaveBeenCalledWith('payment:order123');
    expect(redisClient.del).toHaveBeenCalledTimes(1);
  }, 10000);

  test('throws error when orderId is missing', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue(null);

    const req = {
      params: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await confirmPayment(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith('payment:undefined');
    expect(next).toHaveBeenCalled();
  }, 10000);
});
