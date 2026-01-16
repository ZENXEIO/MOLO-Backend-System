import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Event } from '../models/event.models.js';
import { TicketCategory } from '../models/ticketcat.models.js';

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, venue, city, startTime, endTime, totalSeats } = req.body;

  if (!title || !venue || !city || !startTime || !endTime || !totalSeats) {
    throw new ApiError(401, 'Missing parameters');
  }

  const event = await Event.create({
    title: title,
    description: description,
    venue,
    city,
    startTime: startTime,
    endTime: endTime,
    totalSeats: totalSeats,
    organizer: req.user._id,
    status: 'PUBLISHED',
  });

  return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

const getAllEvents = asyncHandler(async (_, res) => {
  const events = await Event.find().sort({ createdAt: -1 });

  return res.status(201).json(new ApiResponse(201, events, 'Events fetched sucessfully'));
});

const getelemntsbyId = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(401, 'Event not found');
  }

  return res.status(201).json(new ApiResponse(200, event, 'Event fetched succesfully'));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findByIdAndUpdate(eventId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    throw new ApiError(401, 'Event not found');
  }

  return res.status(201).json(new ApiResponse(201, event, 'Event updated successfully'));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findByIdAndUpdate(eventId, { status: 'CANCELLED' }, { new: true });

  if (!event) {
    throw new ApiError(401, 'Event not found');
  }

  return res.status(201).json(new ApiResponse(201, null, 'Event cancelled succesfully'));
});

const createTicketCat = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { name, description, price, totalseats } = req.body;

  if (!name || !description || !price || !totalseats) {
    throw new ApiError(401, 'Missing parameters');
  }

  const event = await Event.findById(eventId);

  console.log('Event ID from params:', eventId);
  console.log('Event from DB:', await Event.findById(eventId));

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const category = await TicketCategory.create({
    name,
    description: description,
    price: price,
    totalSeats: totalseats,
    availableSeats: totalseats,
    event: event._id,
  });

  return res.status(201).json(new ApiResponse(201, category, 'Ticket category created'));
});

const getTicketCat = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const cat = await TicketCategory.find({ event: eventId });

  return res.status(201).json(new ApiResponse(201, cat, 'Ticket categories fetched'));
});

const updateTicketCat = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await TicketCategory.findByIdAndUpdate(categoryId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiError(404, 'Ticket category not found');
  }

  return res.status(200).json(new ApiResponse(200, category, 'Ticket category updated'));
});

const deleteTicketCat = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await TicketCategory.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(401, 'Ticket category not found');
  }

  res.status(201).json(new ApiResponse(200, {}, 'Ticket category deleted'));
});

export {
  createEvent,
  getAllEvents,
  getelemntsbyId,
  updateEvent,
  deleteEvent,
  createTicketCat,
  getTicketCat,
  updateTicketCat,
  deleteTicketCat,
};
