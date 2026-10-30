import { Router } from 'express';
import { CourtController } from '../controllers/courtController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Rotas Públicas
router.get('/', CourtController.list);

// Rota Exclusiva do Admin (Deve vir ANTES de /:id para não conflitar)
router.get('/admin/all', authMiddleware, adminMiddleware, CourtController.listAllForAdmin);

// Rotas com ID (Públicas e Admin)
router.get('/:id', CourtController.getById);
router.post('/', authMiddleware, adminMiddleware, CourtController.create);
router.put('/:id', authMiddleware, adminMiddleware, CourtController.update);
router.delete('/:id', authMiddleware, adminMiddleware, CourtController.delete);

export default router;