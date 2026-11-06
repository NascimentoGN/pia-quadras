import { Review } from '../models/Review.js';

export const ReviewController = {
    create: async (req, res) => {
        try {
            const { booking_id, court_id, rating, comment } = req.body;
            const user_id = req.user.id;

            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'A nota deve ser entre 1 e 5.' });
            }

            const review = await Review.create({ booking_id, court_id, user_id, rating, comment });
            res.status(201).json({ message: 'Avaliação enviada com sucesso!', review });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Você já avaliou esta reserva.' });
            }
            console.error(error);
            res.status(500).json({ error: 'Erro ao enviar avaliação' });
        }
    },

    listByCourt: async (req, res) => {
        try {
            const court_id = req.params.court_id;
            const reviews = await Review.findByCourtId(court_id);
            const stats = await Review.getAverageRating(court_id);
            
            res.json({ reviews, stats });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar avaliações' });
        }
    }
};