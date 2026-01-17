import crypto from 'crypto';
import Ticket from '../models/ticket.models.js';

export const generateTickets = async ({ userId, eventId, orderId, categoryId, quantity }) => {
  console.log('generateTickets CALLED with:', {
    userId,
    eventId,
    orderId,
    categoryId,
    quantity,
  });

  const tickets = [];

  for (let i = 0; i < quantity; i++) {
    tickets.push({
      ticketCode: crypto.randomUUID(),
      user: userId,
      event: eventId,
      order: orderId,
      category: categoryId,
    });
  }

  console.log('Tickets to insert:', tickets.length);

  return await Ticket.insertMany(tickets);
};
