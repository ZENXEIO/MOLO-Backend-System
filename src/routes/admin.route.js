import { Router } from 'express';

import {
  createEvent,
  getAllEvents,
  getelemntsbyId,
  updateEvent,
  deleteEvent,
  createTicketCat,
  updateTicketCat,
  getTicketCat,
  deleteTicketCat,
} from '../controllers/admin.controller.js';

import { verifyJWT } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';

const router = Router();

router.route('/events').post(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), createEvent);
router.route('/all-event').get(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), getAllEvents);
router
  .route('/:eventId/event')
  .get(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), getelemntsbyId);
router
  .route('/:eventId/update-event')
  .put(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), updateEvent);
router
  .route('/:eventId/cancell-event')
  .delete(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), deleteEvent);

// Ticket-category
router
  .route('/:eventId/ticket-category')
  .post(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), createTicketCat);
router
  .route('/:eventId/get-ticket')
  .get(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), getTicketCat);
router
  .route('/:categoryId/update-ticketcat')
  .put(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), updateTicketCat);
router
  .route('/:categoryId/delete-ticketcat')
  .delete(verifyJWT, authorizeRoles('ADMIN', 'ORGANIZER'), deleteTicketCat);

export default router;
