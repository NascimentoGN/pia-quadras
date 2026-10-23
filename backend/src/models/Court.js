import pool from '../config/database.js';

export const Court = {
    // Listar todas as quadras ativas
    findAll: async () => {
        const [rows] = await pool.query(
            'SELECT * FROM courts WHERE is_active = TRUE ORDER BY id ASC'
        );
        return rows;
    },

    // Buscar quadra por ID
    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT * FROM courts WHERE id = ? AND is_active = TRUE LIMIT 1',
            [id]
        );
        return rows[0];
    }
};