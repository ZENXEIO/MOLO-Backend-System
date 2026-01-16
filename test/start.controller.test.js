import { jest } from '@jest/globals';

let startServer;
let ApiResponse;

beforeAll(async () => {
  const startCtrl = await import('../src/controllers/start.controller.js');
  startServer = startCtrl.startServer;

  const respMod = await import('../src/utils/ApiResponse.js');
  ApiResponse = respMod.ApiResponse;
});

describe('startServer', () => {
  test('should return welcome message with status 200', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const result = startServer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: 'Welcome to MOLO server',
      }),
    );
  });

  test('should return ApiResponse instance', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    startServer(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
  });

  test('should return data as null', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    startServer(req, res);

    const callArgs = res.json.mock.calls[0][0];
    expect(callArgs.data).toBeNull();
  });
});
