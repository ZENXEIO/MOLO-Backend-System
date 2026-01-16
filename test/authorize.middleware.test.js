import { jest } from '@jest/globals';

let authorizeRoles;
let ApiError;

beforeAll(async () => {
  const middleware = await import('../src/middleware/authorize.middleware.js');
  authorizeRoles = middleware.authorizeRoles;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;
});

describe('authorizeRoles middleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('allows access when user role is in allowed roles', () => {
    const middleware = authorizeRoles('ADMIN', 'CUSTOMER');

    const req = { user: { role: 'ADMIN' } };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('allows access when user has any of the allowed roles', () => {
    const middleware = authorizeRoles('ADMIN', 'MODERATOR', 'CUSTOMER');

    const req = { user: { role: 'CUSTOMER' } };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('denies access when user role is not in allowed roles', () => {
    const middleware = authorizeRoles('ADMIN');

    const req = { user: { role: 'CUSTOMER' } };
    const res = {};
    const next = jest.fn();

    expect(() => middleware(req, res, next)).toThrow(ApiError);
  });

  test('denies access with correct error code', () => {
    const middleware = authorizeRoles('ADMIN');

    const req = { user: { role: 'GUEST' } };
    const res = {};
    const next = jest.fn();

    try {
      middleware(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(301);
    }
  });

  test('works with single role', () => {
    const middleware = authorizeRoles('ADMIN');

    const req = { user: { role: 'ADMIN' } };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('works with multiple roles', () => {
    const middleware = authorizeRoles('ADMIN', 'MODERATOR', 'CUSTOMER');

    const req = { user: { role: 'MODERATOR' } };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
