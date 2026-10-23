import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // <-- Importe

const router = Router();

// Adicione o authMiddleware antes do Controller
router.post('/', authMiddleware, BookingController.create);

export default router;