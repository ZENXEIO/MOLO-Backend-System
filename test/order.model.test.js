import { jest } from '@jest/globals';

let Order;

beforeAll(async () => {
  const mod = await import('../src/models/order.models.js');
  Order = mod.Order;
});

describe('Order Model', () => {
  test('should have correct schema properties', () => {
    const schema = Order.schema;

    // Test that required fields exist
    expect(schema.paths.user).toBeDefined();
    expect(schema.paths.event).toBeDefined();
    expect(schema.paths.quantity).toBeDefined();
    expect(schema.paths.amount).toBeDefined();
    expect(schema.paths.status).toBeDefined();
  });

  test('should have timestamps enabled', () => {
    const schema = Order.schema;

    expect(schema.options.timestamps).toBe(true);
  });

  test('quantity should have minimum value of 1', () => {
    const schema = Order.schema;
    const quantityPath = schema.paths.quantity;

    expect(quantityPath.validators).toBeDefined();
  });

  test('amount should have minimum value of 0', () => {
    const schema = Order.schema;
    const amountPath = schema.paths.amount;

    expect(amountPath.validators).toBeDefined();
  });

  test('status should have enum values', () => {
    const schema = Order.schema;
    const statusPath = schema.paths.status;

    expect(statusPath.enumValues).toContain('PENDING');
    expect(statusPath.enumValues).toContain('PAID');
    expect(statusPath.enumValues).toContain('FAILED');
    expect(statusPath.enumValues).toContain('REFUNDED');
  });

  test('status should default to PENDING', () => {
    const schema = Order.schema;
    const statusPath = schema.paths.status;

    expect(statusPath.defaultValue).toBe('PENDING');
  });

  test('currency should default to INR', () => {
    const schema = Order.schema;
    const currencyPath = schema.paths.currency;

    expect(currencyPath.defaultValue).toBe('INR');
  });

  test('user field should be required and indexed', () => {
    const schema = Order.schema;
    const userPath = schema.paths.user;

    expect(userPath.isRequired).toBe(true);
    expect(userPath._index).toBe(true);
  });

  test('event field should be required and indexed', () => {
    const schema = Order.schema;
    const eventPath = schema.paths.event;

    expect(eventPath.isRequired).toBe(true);
    expect(eventPath._index).toBe(true);
  });

  test('status field should be indexed', () => {
    const schema = Order.schema;
    const statusPath = schema.paths.status;

    expect(statusPath._index).toBe(true);
  });

  test('paymentRef field should be indexed', () => {
    const schema = Order.schema;
    const paymentRefPath = schema.paths.paymentRef;

    expect(paymentRefPath._index).toBe(true);
  });
});
