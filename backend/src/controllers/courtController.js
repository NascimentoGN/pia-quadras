import { Court } from '../models/Court.js';

export const CourtController = {
    // GET /api/courts
    list: async (req, res) => {
        try {
            const courts = await Court.findAll();
            res.json(courts);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar quadras' });
        }
    },

    // GET /api/courts/:id
    getById: async (req, res) => {
        try {
            const court = await Court.findById(req.params.id);
            if (!court) {
                return res.status(404).json({ error: 'Quadra não encontrada' });
            }
            res.json(court);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar quadra' });
        }
    }
};