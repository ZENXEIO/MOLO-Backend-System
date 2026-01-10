let ApiResponse;

beforeAll(async () => {
  const mod = await import('../src/utils/ApiResponse.js');
  ApiResponse = mod.ApiResponse;
});

describe('ApiResponse', () => {
  test('sets fields correctly for success response', () => {
    const res = new ApiResponse(200, { id: 1 }, 'OK');

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.message).toBe('OK');
    expect(res.success).toBe(true);
  });

  test('marks failure when statusCode >= 400', () => {
    const res = new ApiResponse(404, null, 'Not Found');

    expect(res.statusCode).toBe(404);
    expect(res.message).toBe('Not Found');
    expect(res.success).toBe(false);
  });
});
