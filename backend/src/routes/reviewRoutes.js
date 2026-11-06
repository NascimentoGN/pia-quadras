import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota pública para listar avaliações de uma quadra
router.get('/court/:court_id', ReviewController.listByCourt);

// Rota protegida para criar uma avaliação
router.post('/', authMiddleware, ReviewController.create);

export default router;