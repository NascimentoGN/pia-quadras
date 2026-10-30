import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, BookingController.create);
router.get('/my-bookings', authMiddleware, BookingController.listMyBookings);
router.get('/:id', authMiddleware, BookingController.getDetails); // <-- VOLTOU A TRAVA

export default router;