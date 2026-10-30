import { Router } from 'express';
import { WaitlistController } from '../controllers/waitlistController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, WaitlistController.join);

export default router;