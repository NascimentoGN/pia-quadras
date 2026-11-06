import pool from '../config/database.js';

export const Court = {
    findAll: async () => {
        const [rows] = await pool.query(
            `SELECT 
                c.*, 
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as total_reviews
             FROM courts c
             LEFT JOIN reviews r ON c.id = r.court_id
             WHERE c.is_active = TRUE
             GROUP BY c.id
             ORDER BY c.id ASC`
        );
        return rows;
    },

    findAllForAdmin: async () => {
        const [rows] = await pool.query('SELECT * FROM courts ORDER BY id ASC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM courts WHERE id = ? AND is_active = TRUE LIMIT 1', [id]);
        return rows[0];
    },

    create: async ({ name, type, description, price_per_hour, price_peak_hour, capacity }) => {
        const [result] = await pool.query(
            `INSERT INTO courts (name, type, description, price_per_hour, price_peak_hour, capacity, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
            [name, type, description, price_per_hour, price_peak_hour, capacity]
        );
        return { id: result.insertId, name, type, price_per_hour };
    },

    update: async (id, { name, type, description, price_per_hour, price_peak_hour, capacity, is_active }) => {
        const [result] = await pool.query(
            `UPDATE courts 
             SET name = ?, type = ?, description = ?, price_per_hour = ?, price_peak_hour = ?, capacity = ?, is_active = ?
             WHERE id = ?`,
            [name, type, description, price_per_hour, price_peak_hour, capacity, is_active, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('UPDATE courts SET is_active = FALSE WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};