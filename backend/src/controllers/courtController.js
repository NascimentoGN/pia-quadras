import { Court } from '../models/Court.js';

export const CourtController = {
    list: async (req, res) => {
        try {
            const courts = await Court.findAll();
            res.json(courts);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar quadras' });
        }
    },

    // NOVO MÉTODO
    listAllForAdmin: async (req, res) => {
        try {
            const courts = await Court.findAllForAdmin();
            res.json(courts);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar quadras para o admin' });
        }
    },

    getById: async (req, res) => {
        try {
            const court = await Court.findById(req.params.id);
            if (!court) return res.status(404).json({ error: 'Quadra não encontrada' });
            res.json(court);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar quadra' });
        }
    },

    create: async (req, res) => {
        try {
            const court = await Court.create(req.body);
            res.status(201).json({ message: 'Quadra criada com sucesso!', court });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar quadra' });
        }
    },

    update: async (req, res) => {
        try {
            const updated = await Court.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({ error: 'Quadra não encontrada' });
            res.json({ message: 'Quadra atualizada com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar quadra' });
        }
    },

    delete: async (req, res) => {
        try {
            const deleted = await Court.delete(req.params.id);
            if (!deleted) return res.status(404).json({ error: 'Quadra não encontrada' });
            res.json({ message: 'Quadra desativada com sucesso!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao desativar quadra' });
        }
    }
};