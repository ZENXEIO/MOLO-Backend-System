import { jest } from '@jest/globals';

let asyncHandler;

beforeAll(async () => {
  const mod = await import('../src/utils/asyncHandler.js');
  asyncHandler = mod.asyncHandler;
});

describe('asyncHandler', () => {
  test('calls next with error when handler rejects', async () => {
    const err = new Error('boom');
    const handler = async () => {
      throw err;
    };

    const wrapped = asyncHandler(handler);

    const next = jest.fn();
    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBe(err);
  });

  test('resolves normally when handler succeeds', async () => {
    const handler = async (req, res) => {
      res.called = true;
    };

    const wrapped = asyncHandler(handler);

    const next = jest.fn();
    const req = {};
    const res = {};

    await wrapped(req, res, next);

    expect(res.called).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });
});
