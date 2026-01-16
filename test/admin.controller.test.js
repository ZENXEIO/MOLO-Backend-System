import { jest } from '@jest/globals';

let createEvent;
let getAllEvents;
let getelemntsbyId;
let updateEvent;
let deleteEvent;
let createTicketCat;
let Event;
let TicketCategory;
let ApiError;
let ApiResponse;

beforeAll(async () => {
  const adminCtrl = await import('../src/controllers/admin.controller.js');
  createEvent = adminCtrl.createEvent;
  getAllEvents = adminCtrl.getAllEvents;
  getelemntsbyId = adminCtrl.getelemntsbyId;
  updateEvent = adminCtrl.updateEvent;
  deleteEvent = adminCtrl.deleteEvent;
  createTicketCat = adminCtrl.createTicketCat;

  const eventMod = await import('../src/models/event.models.js');
  Event = eventMod.Event;

  const ticketcatMod = await import('../src/models/ticketcat.models.js');
  TicketCategory = ticketcatMod.TicketCategory;

  const errMod = await import('../src/utils/ApiError.js');
  ApiError = errMod.ApiError;

  const respMod = await import('../src/utils/ApiResponse.js');
  ApiResponse = respMod.ApiResponse;
});

describe('createEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should throw error when required fields are missing', async () => {
    const req = {
      body: { title: 'Test Event' },
      user: { _id: 'userId123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].message).toBe('Missing parameters');
  });

  test('should create event with valid data', async () => {
    const eventData = {
      title: 'Concert 2025',
      description: 'Amazing concert',
      venue: 'Central Hall',
      city: 'New York',
      startTime: '2025-05-15T18:00:00Z',
      endTime: '2025-05-15T22:00:00Z',
      totalSeats: 500,
    };

    jest.spyOn(Event, 'create').mockResolvedValue({
      _id: 'eventId123',
      ...eventData,
      organizer: 'userId123',
      status: 'PUBLISHED',
    });

    const req = {
      body: eventData,
      user: { _id: 'userId123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    expect(next).not.toHaveBeenCalled();
  });
});

describe('getAllEvents', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch all events sorted by creation date', async () => {
    const mockEvents = [
      {
        _id: 'event1',
        title: 'Concert',
        createdAt: new Date('2025-01-20'),
      },
      {
        _id: 'event2',
        title: 'Conference',
        createdAt: new Date('2025-01-15'),
      },
    ];

    jest.spyOn(Event, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockEvents),
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getAllEvents(req, res, next);

    expect(Event.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return empty array when no events exist', async () => {
    jest.spyOn(Event, 'find').mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getAllEvents(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('getelemntsbyId', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should fetch event by id', async () => {
    const eventId = 'eventId123';
    const mockEvent = {
      _id: eventId,
      title: 'Concert',
      venue: 'Hall A',
    };

    jest.spyOn(Event, 'findById').mockResolvedValue(mockEvent);

    const req = { params: { eventId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getelemntsbyId(req, res, next);

    expect(Event.findById).toHaveBeenCalledWith(eventId);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw error when event not found', async () => {
    jest.spyOn(Event, 'findById').mockResolvedValue(null);

    const req = { params: { eventId: 'invalid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getelemntsbyId(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].message).toBe('Event not found');
  });
});

describe('updateEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should update event with valid data', async () => {
    const eventId = 'eventId123';
    const updateData = { title: 'Updated Concert' };
    const updatedEvent = {
      _id: eventId,
      ...updateData,
    };

    jest.spyOn(Event, 'findByIdAndUpdate').mockResolvedValue(updatedEvent);

    const req = {
      params: { eventId },
      body: updateData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateEvent(req, res, next);

    expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(eventId, updateData, {
      new: true,
      runValidators: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw error when event not found during update', async () => {
    jest.spyOn(Event, 'findByIdAndUpdate').mockResolvedValue(null);

    const req = {
      params: { eventId: 'invalid' },
      body: { title: 'New Title' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].message).toBe('Event not found');
  });
});

describe('deleteEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should cancel event by setting status to CANCELLED', async () => {
    const eventId = 'eventId123';
    const cancelledEvent = {
      _id: eventId,
      status: 'CANCELLED',
    };

    jest.spyOn(Event, 'findByIdAndUpdate').mockResolvedValue(cancelledEvent);

    const req = { params: { eventId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteEvent(req, res, next);

    expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
      eventId,
      { status: 'CANCELLED' },
      { new: true },
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  test('should throw error when event not found during deletion', async () => {
    jest.spyOn(Event, 'findByIdAndUpdate').mockResolvedValue(null);

    const req = { params: { eventId: 'invalid' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await deleteEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].message).toBe('Event not found');
  });
});

describe('createTicketCat', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should throw error when required fields are missing', async () => {
    const req = {
      params: { eventId: 'eventId123' },
      body: { name: 'VIP' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(Event, 'findById').mockResolvedValue({ _id: 'eventId123' });

    await createTicketCat(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
  });

  test('should throw error when event not found', async () => {
    jest.spyOn(Event, 'findById').mockResolvedValue(null);

    const req = {
      params: { eventId: 'invalid' },
      body: {
        name: 'VIP',
        description: 'VIP tickets',
        price: 100,
        totalseats: 50,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createTicketCat(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(ApiError);
    expect(next.mock.calls[0][0].message).toBe('Event not found');
  });

  test('should create ticket category with valid data', async () => {
    const eventId = 'eventId123';
    const ticketData = {
      name: 'VIP',
      description: 'VIP tickets',
      price: 100,
      totalseats: 50,
    };

    jest.spyOn(Event, 'findById').mockResolvedValue({ _id: eventId });
    jest.spyOn(TicketCategory, 'create').mockResolvedValue({
      _id: 'catId123',
      ...ticketData,
      availableSeats: ticketData.totalseats,
      event: eventId,
    });

    const req = {
      params: { eventId },
      body: ticketData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await createTicketCat(req, res, next);

    expect(TicketCategory.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    expect(next).not.toHaveBeenCalled();
  });
});
