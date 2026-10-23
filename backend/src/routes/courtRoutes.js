import { Router } from 'express';
import { CourtController } from '../controllers/courtController.js';

const router = Router();

// Rota pública (qualquer um pode ver as quadras)
router.get('/', CourtController.list);
router.get('/:id', CourtController.getById);

export default router;