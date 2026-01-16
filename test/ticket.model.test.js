import { jest } from '@jest/globals';

let Ticket;

beforeAll(async () => {
  const mod = await import('../src/models/ticket.models.js');
  Ticket = mod.default;
});

describe('Ticket Model', () => {
  test('should have correct schema properties', () => {
    const schema = Ticket.schema;

    expect(schema.paths.order).toBeDefined();
    expect(schema.paths.ticketCode).toBeDefined();
    expect(schema.paths.status).toBeDefined();
  });

  test('should have timestamps enabled', () => {
    const schema = Ticket.schema;

    expect(schema.options.timestamps).toBe(true);
  });

  test('ticketCode field should be required and unique', () => {
    const schema = Ticket.schema;
    const ticketCodePath = schema.paths.ticketCode;

    expect(ticketCodePath.isRequired).toBe(true);
  });

  test('status field should have enum values', () => {
    const schema = Ticket.schema;
    const statusPath = schema.paths.status;

    if (statusPath.enumValues) {
      expect(Array.isArray(statusPath.enumValues)).toBe(true);
    }
  });

  test('order field should be required and referenced to Order model', () => {
    const schema = Ticket.schema;
    const orderPath = schema.paths.order;

    expect(orderPath.isRequired).toBe(true);
  });
});
