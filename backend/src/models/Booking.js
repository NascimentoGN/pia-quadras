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
    },

    findByUserId: async (user_id) => {
        const [rows] = await pool.query(
            `SELECT b.*, c.name as court_name 
             FROM bookings b
             JOIN courts c ON b.court_id = c.id
             WHERE b.user_id = ?
             ORDER BY b.booking_date DESC, b.start_time DESC`,
            [user_id]
        );
        return rows;
    },

    addPlayers: async (booking_id, players) => {
        const values = players.map(p => [
            booking_id, 
            p.user_id || null, 
            p.guest_email || null, 
            p.amount_due, 
            'pending'
        ]);

        if (values.length > 0) {
            await pool.query(
                `INSERT INTO booking_players (booking_id, user_id, guest_email, amount_due, payment_status) 
                 VALUES ?`,
                [values]
            );
        }
    },

        findDetailsById: async (booking_id, user_id) => {
        // 1. Busca a reserva principal
        const [bookingRows] = await pool.query(
            `SELECT b.*, c.name as court_name 
             FROM bookings b
             JOIN courts c ON b.court_id = c.id
             WHERE b.id = ? AND b.user_id = ?`,
            [booking_id, user_id]
        );

        if (bookingRows.length === 0) return null;
        const booking = bookingRows[0];

        // 2. Busca os jogadores (sem JOIN para evitar erros)
        const [players] = await pool.query(
            `SELECT id, amount_due, payment_status, guest_email, user_id 
             FROM booking_players 
             WHERE booking_id = ?`,
            [booking_id]
        );

        return { ...booking, players };
    }
};