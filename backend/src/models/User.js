import pool from '../config/database.js';

export const User = {
    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return rows[0];
    },
    findById: async (id) => {
        const [rows] = await pool.query('SELECT id, name, email, phone, role, avatar_url, is_active, created_at FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0];
    },
    create: async ({ name, email, password_hash, phone, role = 'player' }) => {
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)`,
            [name, email, password_hash, phone, role]
        );
        return { id: result.insertId, name, email, phone, role };
    },
    emailExists: async (email) => {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
        return rows.length > 0;
    }
};