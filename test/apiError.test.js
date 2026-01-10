let ApiError;

beforeAll(async () => {
  const mod = await import('../src/utils/ApiError.js');
  ApiError = mod.ApiError;
});

describe('ApiError', () => {
  test('is an Error and sets provided properties', () => {
    const err = new ApiError(500, 'Server failure', [{ field: 'x' }]);

    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe('Server failure');
    expect(err.success).toBe(false);
    expect(err.errors).toEqual([{ field: 'x' }]);
    expect(typeof err.stack).toBe('string');
  });

  test('uses provided stack when given', () => {
    const customStack = 'Custom stack trace';
    const err = new ApiError(400, 'Bad', [], customStack);

    expect(err.stack).toBe(customStack);
  });
});
