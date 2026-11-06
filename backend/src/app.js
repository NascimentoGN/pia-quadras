import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'; // <-- NOVO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes); // <-- NOVO

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Pia Quadra API rodando! 🏐' });
});

const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
};

startServer();