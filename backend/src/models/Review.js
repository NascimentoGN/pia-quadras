import pool from '../config/database.js';

export const Review = {
    create: async ({ booking_id, court_id, user_id, rating, comment }) => {
        const [result] = await pool.query(
            `INSERT INTO reviews (booking_id, court_id, user_id, rating, comment) 
             VALUES (?, ?, ?, ?, ?)`,
            [booking_id, court_id, user_id, rating, comment]
        );
        return { id: result.insertId };
    },

    findByCourtId: async (court_id) => {
        const [rows] = await pool.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.court_id = ?
             ORDER BY r.created_at DESC`,
            [court_id]
        );
        return rows;
    },

    getAverageRating: async (court_id) => {
        const [rows] = await pool.query(
            `SELECT AVG(rating) as average, COUNT(*) as total 
             FROM reviews 
             WHERE court_id = ?`,
            [court_id]
        );
        return { average: rows[0].average || 0, total: rows[0].total };
    }
};