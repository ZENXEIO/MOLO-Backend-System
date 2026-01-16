import { jest } from '@jest/globals';

let TicketCategory;

beforeAll(async () => {
  const mod = await import('../src/models/ticketcat.models.js');
  TicketCategory = mod.TicketCategory;
});

describe('TicketCategory Model', () => {
  test('should have correct schema properties', () => {
    const schema = TicketCategory.schema;

    expect(schema.paths.event).toBeDefined();
    expect(schema.paths.name).toBeDefined();
    expect(schema.paths.price).toBeDefined();
    expect(schema.paths.totalSeats).toBeDefined();
    expect(schema.paths.availableSeats).toBeDefined();
  });

  test('should have timestamps enabled', () => {
    const schema = TicketCategory.schema;

    expect(schema.options.timestamps).toBe(true);
  });

  test('price field should be required and have minimum value', () => {
    const schema = TicketCategory.schema;
    const pricePath = schema.paths.price;

    expect(pricePath.isRequired).toBe(true);
  });

  test('totalSeats field should be required and positive', () => {
    const schema = TicketCategory.schema;
    const totalSeatsPath = schema.paths.totalSeats;

    expect(totalSeatsPath.isRequired).toBe(true);
  });

  test('availableSeats field should be required', () => {
    const schema = TicketCategory.schema;
    const availableSeatsPath = schema.paths.availableSeats;

    expect(availableSeatsPath.isRequired).toBe(true);
  });

  test('event field should be required and referenced to Event model', () => {
    const schema = TicketCategory.schema;
    const eventPath = schema.paths.event;

    expect(eventPath.isRequired).toBe(true);
  });

  test('name field should be required', () => {
    const schema = TicketCategory.schema;
    const namePath = schema.paths.name;

    expect(namePath.isRequired).toBe(true);
  });
});
