import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Apenas Admin pode listar todos os usuários
router.get('/', authMiddleware, adminMiddleware, UserController.listAll);

export default router;