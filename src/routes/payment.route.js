import Router from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { createPayementIntent, confirmPayment } from '../controllers/payment.controller.js';

const router = Router();

router.route('/:orderId/open-portel').post(verifyJWT, createPayementIntent);
router.route('/:orderId/payment-complet').post(verifyJWT, confirmPayment);

export default router;
