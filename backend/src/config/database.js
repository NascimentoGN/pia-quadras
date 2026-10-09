import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '-03:00',
    dateStrings: true,
});

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL - Schema: pia_quadras');
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar no MySQL:', error.message);
        process.exit(1);
    }
};

export default pool;