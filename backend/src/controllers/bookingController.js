import { Booking } from '../models/Booking.js';

export const BookingController = {
    create: async (req, res) => {
        try {
            const { court_id, booking_date, start_time, end_time, total_price, guest_emails } = req.body;
            const user_id = req.user.id; 

            const booking = await Booking.create({
                court_id, user_id, booking_date, start_time, end_time, total_price
            });

            const totalPeople = 1 + (guest_emails ? guest_emails.length : 0);
            const amountPerPerson = total_price / totalPeople;

            const players = [];
            players.push({ user_id: user_id, amount_due: amountPerPerson });

            if (guest_emails && guest_emails.length > 0) {
                guest_emails.forEach(email => {
                    players.push({ guest_email: email, amount_due: amountPerPerson });
                });
            }

            await Booking.addPlayers(booking.id, players);

            res.status(201).json({ message: 'Reserva criada!', booking, amount_per_person: amountPerPerson });
        } catch (error) {
            if (error.message === 'Este horário já está reservado para esta quadra.') {
                return res.status(409).json({ error: error.message });
            }
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar reserva' });
        }
    },

    listMyBookings: async (req, res) => {
        try {
            const bookings = await Booking.findByUserId(req.user.id);
            res.json(bookings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar reservas' });
        }
    },

    getDetails: async (req, res) => {
        try {
            const booking_id = req.params.id;
            const user_id = req.user.id;

            const booking = await Booking.findDetailsById(booking_id, user_id);

            if (!booking) {
                return res.status(404).json({ error: 'Reserva não encontrada ou não pertence a você.' });
            }

            res.json(booking);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar detalhes da reserva' });
        }
    },

    listAllForAdmin: async (req, res) => {
        try {
            const bookings = await Booking.findAllForAdmin();
            res.json(bookings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar todas as reservas' });
        }
    },

    // NOVO MÉTODO
    updateStatus: async (req, res) => {
        try {
            const booking_id = req.params.id;
            const { status } = req.body;

            if (!['confirmed', 'cancelled'].includes(status)) {
                return res.status(400).json({ error: 'Status inválido.' });
            }

            const updated = await Booking.updateStatus(booking_id, status);

            if (!updated) {
                return res.status(404).json({ error: 'Reserva não encontrada.' });
            }

            res.json({ message: `Reserva ${status === 'confirmed' ? 'confirmada' : 'cancelada'} com sucesso!` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar status da reserva.' });
        }
    }
};