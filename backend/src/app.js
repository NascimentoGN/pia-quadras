import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/api/courts', courtRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Pia Quadras API rodando! 🏐',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
        console.log(`🏟️ Quadras: http://localhost:${PORT}/api/courts`);
    });
};

startServer();