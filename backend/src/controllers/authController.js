import { AuthService } from '../services/authService.js';

export const AuthController = {
    register: async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            const result = await AuthService.register({ name, email, password, phone });
            res.status(201).json({ message: 'Usuário criado com sucesso!', ...result });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });
            res.json({ message: 'Login realizado com sucesso!', ...result });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    me: async (req, res) => {
        res.json({ user: req.user });
    }
};