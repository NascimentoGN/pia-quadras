import pool from '../config/database.js';

export const Booking = {
    checkAvailability: async ({ court_id, booking_date, start_time, end_time }) => {
        const [rows] = await pool.query(
            `SELECT id FROM bookings 
             WHERE court_id = ? 
             AND booking_date = ? 
             AND status != 'cancelled' 
             AND (
                 (start_time < ? AND end_time > ?) OR 
                 (start_time < ? AND end_time > ?) OR
                 (start_time >= ? AND end_time <= ?)
             )`,
            [
                court_id, 
                booking_date, 
                end_time, start_time, 
                end_time, start_time,
                start_time, end_time
            ]
        );
        return rows.length > 0;
    },

    create: async ({ court_id, user_id, booking_date, start_time, end_time, total_price }) => {
        const isOccupied = await Booking.checkAvailability({ court_id, booking_date, start_time, end_time });
        
        if (isOccupied) {
            throw new Error('Este horário já está reservado para esta quadra.');
        }

        const [result] = await pool.query(
            `INSERT INTO bookings (court_id, user_id, booking_date, start_time, end_time, total_price, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [court_id, user_id, booking_date, start_time, end_time, total_price]
        );
        return { id: result.insertId, court_id, user_id, booking_date, start_time, end_time, total_price };
    }
};