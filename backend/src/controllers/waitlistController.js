import { Waitlist } from '../models/Waitlist.js';

export const WaitlistController = {
    join: async (req, res) => {
        try {
            const { court_id, desired_date, desired_start_time, desired_end_time } = req.body;
            const user_id = req.user.id;

            // Verifica se já não está na fila
            const alreadyIn = await Waitlist.checkIfInWaitlist({
                court_id, user_id, desired_date, desired_start_time
            });

            if (alreadyIn) {
                return res.status(400).json({ error: 'Você já está na lista de espera para este horário.' });
            }

            const waitlistEntry = await Waitlist.create({
                court_id, user_id, desired_date, desired_start_time, desired_end_time
            });

            res.status(201).json({ 
                message: 'Você entrou na lista de espera! Avisaremos se o horário vagar.', 
                waitlistEntry 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao entrar na lista de espera' });
        }
    }
};