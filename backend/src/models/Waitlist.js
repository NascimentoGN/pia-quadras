import pool from '../config/database.js';

export const Waitlist = {
    // Adicionar à lista de espera
    create: async ({ court_id, user_id, desired_date, desired_start_time, desired_end_time }) => {
        const [result] = await pool.query(
            `INSERT INTO waitlist (court_id, user_id, desired_date, desired_start_time, desired_end_time, status) 
             VALUES (?, ?, ?, ?, ?, 'waiting')`,
            [court_id, user_id, desired_date, desired_start_time, desired_end_time]
        );
        return { id: result.insertId };
    },

    // Verificar se o usuário já está na lista para esse horário
    checkIfInWaitlist: async ({ court_id, user_id, desired_date, desired_start_time }) => {
        const [rows] = await pool.query(
            `SELECT id FROM waitlist 
             WHERE court_id = ? AND user_id = ? AND desired_date = ? AND desired_start_time = ? AND status = 'waiting'`,
            [court_id, user_id, desired_date, desired_start_time]
        );
        return rows.length > 0;
    }
};