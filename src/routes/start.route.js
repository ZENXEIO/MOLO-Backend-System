import { Router } from 'express';
import { startServer } from '../controllers/start.controller.js';

const router = Router();

router.route('/').get(startServer);

export default router;
