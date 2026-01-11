import { jest } from '@jest/globals';

let registerUser;
let loginUser;
let User;
let ApiError;
let ApiResponse;

beforeAll(async () => {
  const ctrl = await import('../src/controllers/user.controller.js');
  registerUser = ctrl.registerUser;
  loginUser = ctrl.loginUser;

  const userMod = await import('../src/models/user.models.js');
  User = userMod.User;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;

  const respMod = await import('../src/utils/ApiResponse.js');
  ApiResponse = respMod.ApiResponse;
});

describe('registerUser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('rejects when required fields are missing', async () => {
    const req = { body: { username: 'a' } }; // missing many fields
    const res = {};
    const next = jest.fn();

    await registerUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('rejects when user already exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ username: 'exists' });

    const req = {
      body: {
        username: 'exists',
        email: 'x@x.com',
        password: 'p',
        confirmpassword: 'p',
        role: 'CUSTOMER',
      },
    };
    const res = {};
    const next = jest.fn();

    await registerUser(req, res, next);

    expect(User.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('creates user and returns response on success', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const created = { _id: 'id', username: 'u', email: 'e' };
    jest.spyOn(User, 'create').mockResolvedValue(created);
    // make findById return a chainable object with select() resolving to created
    jest.spyOn(User, 'findById').mockReturnValue({ select: jest.fn().mockResolvedValue(created) });

    const req = {
      body: {
        username: 'newuser',
        email: 'e@e.com',
        password: 'p',
        confirmpassword: 'p',
        role: 'CUSTOMER',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await registerUser(req, res, next);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();

    const sent = res.json.mock.calls[0][0];
    expect(sent).toBeInstanceOf(ApiResponse);
    expect(sent.statusCode).toBe(201);
  });
});

describe('loginUser', () => {
  afterEach(() => jest.restoreAllMocks());

  test('rejects when username and email are missing', async () => {
    const req = { body: {} };
    const res = {};
    const next = jest.fn();

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('rejects when user not found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const req = { body: { email: 'x@x.com', password: 'p' } };
    const res = {};
    const next = jest.fn();

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('rejects when password invalid', async () => {
    const user = { isPasswordCorrect: jest.fn().mockResolvedValue(false) };
    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    const req = { body: { email: 'x@x.com', password: 'p' } };
    const res = {};
    const next = jest.fn();

    await loginUser(req, res, next);

    expect(user.isPasswordCorrect).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('logs in successfully and sets cookies', async () => {
    const user = {
      _id: 'u1',
      isPasswordCorrect: jest.fn().mockResolvedValue(true),
      generateAccessToken: jest.fn().mockReturnValue('at'),
      generateRefreshToken: jest.fn().mockReturnValue('rt'),
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(user);
    // First call to findById is in token generation (should return the user with methods)
    jest
      .spyOn(User, 'findById')
      .mockResolvedValueOnce(user)
      // Second call is to fetch the logged-in user and uses .select()
      .mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ _id: 'u1', username: 'u' }) });

    const req = { body: { email: 'x@x.com', password: 'p' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await loginUser(req, res, next);

    expect(user.isPasswordCorrect).toHaveBeenCalled();
    expect(user.generateAccessToken).toHaveBeenCalled();
    expect(user.generateRefreshToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
