import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { createOrder, getmyorder } from '../controllers/order.controller.js';

const router = Router();

router.route('/:categoryId/create-order').post(verifyJWT, createOrder);
router.route('/:categoryId/get-my-order').get(verifyJWT, getmyorder);

export default router;
