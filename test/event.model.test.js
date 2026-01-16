import { jest } from '@jest/globals';

let Event;

beforeAll(async () => {
  const mod = await import('../src/models/event.models.js');
  Event = mod.Event;
});

describe('Event Model', () => {
  test('should have correct schema properties', () => {
    const schema = Event.schema;

    expect(schema.paths.title).toBeDefined();
    expect(schema.paths.description).toBeDefined();
    expect(schema.paths.startTime).toBeDefined();
    expect(schema.paths.venue).toBeDefined();
  });

  test('should have timestamps enabled', () => {
    const schema = Event.schema;

    expect(schema.options.timestamps).toBe(true);
  });

  test('title field should be required', () => {
    const schema = Event.schema;
    const titlePath = schema.paths.title;

    expect(titlePath.isRequired).toBe(true);
  });

  test('startTime field should be a Date type', () => {
    const schema = Event.schema;
    const startTimePath = schema.paths.startTime;

    expect(startTimePath.instance).toBe('Date');
  });

  test('venue field should exist in schema', () => {
    const schema = Event.schema;

    expect(schema.paths.venue).toBeDefined();
  });

  test('description field should exist in schema', () => {
    const schema = Event.schema;

    expect(schema.paths.description).toBeDefined();
  });
});
