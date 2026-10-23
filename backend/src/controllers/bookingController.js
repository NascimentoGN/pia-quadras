import { Booking } from '../models/Booking.js';

export const BookingController = {
    create: async (req, res) => {
        try {
            const { court_id, booking_date, start_time, end_time, total_price } = req.body;
            
            // O authMiddleware coloca os dados do token em req.user
            const user_id = req.user.id; // <-- AGORA PEGAMOS O ID REAL

            const booking = await Booking.create({
                court_id, user_id, booking_date, start_time, end_time, total_price
            });

            res.status(201).json({ message: 'Reserva criada com sucesso!', booking });
        } catch (error) {
            if (error.message === 'Este horário já está reservado para esta quadra.') {
                return res.status(409).json({ error: error.message });
            }
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar reserva' });
        }
    }
};