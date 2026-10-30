import { User } from '../models/User.js';

export const UserController = {
    listAll: async (req, res) => {
        try {
            const users = await User.findAllForAdmin();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }
};