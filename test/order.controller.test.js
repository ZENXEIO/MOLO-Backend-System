import { jest } from '@jest/globals';

let createOrder;
let Order;
let TicketCategory;
let ApiError;
let ApiResponse;

beforeAll(async () => {
  const ctrl = await import('../src/controllers/order.controller.js');
  createOrder = ctrl.createOrder;

  const orderMod = await import('../src/models/order.models.js');
  Order = orderMod.Order;

  const ticketMod = await import('../src/models/ticketcat.models.js');
  TicketCategory = ticketMod.TicketCategory;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;

  const respMod = await import('../src/utils/ApiResponse.js');
  ApiResponse = respMod.ApiResponse;
});

describe('createOrder', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('creates order successfully with valid data', async () => {
    const mockCategory = {
      _id: 'cat123',
      event: 'event123',
      price: 100,
      availableSeats: 5,
    };

    const mockOrder = {
      _id: 'order123',
      user: 'user123',
      event: 'event123',
      amount: 200,
      quantity: 2,
      status: 'PENDING',
    };

    jest.spyOn(TicketCategory, 'findOneAndUpdate').mockResolvedValue(mockCategory);
    jest.spyOn(Order, 'create').mockResolvedValue(mockOrder);

    const req = {
      params: { categoryId: 'cat123' },
      body: { quantity: 2 },
      user: { _id: 'user123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createOrder(req, res, next);

    expect(TicketCategory.findOneAndUpdate).toHaveBeenCalledWith(
      {
        _id: 'cat123',
        availableSeats: { $gte: 2 },
      },
      { $inc: { availableSeats: -2 } },
      { new: true },
    );

    expect(Order.create).toHaveBeenCalledWith({
      user: 'user123',
      event: 'event123',
      amount: 200,
      quantity: 2,
      status: 'PENDING',
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects when categoryId is missing', async () => {
    const req = {
      params: {},
      body: { quantity: 2 },
      user: { _id: 'user123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('rejects when quantity is invalid', async () => {
    const req = {
      params: { categoryId: 'cat123' },
      body: { quantity: 0 },
      user: { _id: 'user123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test('rejects when not enough seats available', async () => {
    jest.spyOn(TicketCategory, 'findOneAndUpdate').mockResolvedValue(null);

    const req = {
      params: { categoryId: 'cat123' },
      body: { quantity: 100 },
      user: { _id: 'user123' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await createOrder(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe('Not enough seats');
  });
});
