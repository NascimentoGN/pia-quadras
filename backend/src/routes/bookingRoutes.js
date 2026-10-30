import { Router } from 'express';
import { BookingController } from '../controllers/bookingController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, BookingController.create);
router.get('/my-bookings', authMiddleware, BookingController.listMyBookings);
router.get('/admin/all', authMiddleware, adminMiddleware, BookingController.listAllForAdmin);
router.put('/:id/status', authMiddleware, adminMiddleware, BookingController.updateStatus); // <-- NOVA ROTA
router.get('/:id', authMiddleware, BookingController.getDetails);

export default router;