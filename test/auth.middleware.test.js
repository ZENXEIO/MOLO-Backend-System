import { jest } from '@jest/globals';

let verifyJWT;
let User;
let jwt;
let ApiError;

beforeAll(async () => {
  const mw = await import('../src/middleware/auth.middleware.js');
  verifyJWT = mw.verifyJWT;

  const userMod = await import('../src/models/user.models.js');
  User = userMod.User;

  const jwtMod = await import('jsonwebtoken');
  jwt = jwtMod.default || jwtMod;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;
});

describe('verifyJWT middleware', () => {
  afterEach(() => jest.restoreAllMocks());

  test('calls next with ApiError when token missing', async () => {
    const req = { cookies: {}, header: () => undefined };
    const res = {};
    const next = jest.fn();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ApiError);
  });

  test('calls next with ApiError when token invalid', async () => {
    const req = { cookies: {}, header: () => 'Bearer bad' };
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('invalid');
    });

    const res = {};
    const next = jest.fn();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('sets req.user and calls next on valid token', async () => {
    const token = 'good';
    const decoded = { _id: 'u1' };
    jest.spyOn(jwt, 'verify').mockReturnValue(decoded);

    const user = { _id: 'u1', username: 'u' };
    // Mongoose query chaining: return an object with select() that resolves to the user
    jest.spyOn(User, 'findById').mockReturnValue({ select: jest.fn().mockResolvedValue(user) });

    const req = { cookies: { accessToken: token }, header: () => undefined };
    const res = {};
    const next = jest.fn();

    await verifyJWT(req, res, next);

    expect(User.findById).toHaveBeenCalledWith(decoded._id);
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(0); // called without arguments
  });
});
