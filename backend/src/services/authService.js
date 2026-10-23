import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const SALT_ROUNDS = 10;

export const AuthService = {
    register: async ({ name, email, password, phone }) => {
        if (!name || !email || !password) throw new Error('Nome, email e senha são obrigatórios');
        if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');
        const exists = await User.emailExists(email);
        if (exists) throw new Error('Este email já está cadastrado');

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ name, email, password_hash, phone });
        const token = AuthService.generateToken(user);
        return { user, token };
    },

    login: async ({ email, password }) => {
        if (!email || !password) throw new Error('Email e senha são obrigatórios');
        const user = await User.findByEmail(email);
        if (!user || !user.is_active) throw new Error('Credenciais inválidas');

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) throw new Error('Credenciais inválidas');

        const { password_hash, ...userWithoutPassword } = user;
        const token = AuthService.generateToken(userWithoutPassword);
        return { user: userWithoutPassword, token };
    },

    generateToken: (user) => {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }
};