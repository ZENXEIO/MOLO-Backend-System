let User;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

beforeAll(async () => {
  const mod = await import('../src/models/user.models.js');
  User = mod.User;
});

describe('User model', () => {
  test('schema has refreshToken field', () => {
    const path = User.schema.path('refreshToken');
    expect(path).toBeDefined();
    expect(path.instance).toBe('String');
  });

  test('isPasswordCorrect works for correct and incorrect passwords', async () => {
    const plain = 'secret123';
    const hashed = await bcrypt.hash(plain, 10);
    const user = new User({ password: hashed });

    await expect(user.isPasswordCorrect(plain)).resolves.toBe(true);
    await expect(user.isPasswordCorrect('wrong')).resolves.toBe(false);
  });

  test('generateAccessToken signs payload and verifies with secret', () => {
    process.env.ACCESS_TOKEN_SECRET = 'test_access_secret';
    process.env.ACCESS_TOKEN_EXPIRY = '1h';

    const user = new User({ _id: '507f1f77bcf86cd799439011', email: 'a@b.c', username: 'user1' });
    const token = user.generateAccessToken();

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    expect(String(payload._id)).toBe(String(user._id));
    expect(payload.email).toBe(user.email);
    expect(payload.username).toBe(user.username);
  });

  test('generateRefreshToken signs payload and verifies with secret', () => {
    process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';
    process.env.REFRESH_TOKEN_EXPIRY = '7d';

    const user = new User({ _id: '507f1f77bcf86cd799439011' });
    const token = user.generateRefreshToken();

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    expect(String(payload._id)).toBe(String(user._id));
  });
});
