import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send("Backend está rodando! 🚀 <br> Frontend: <a href='http://localhost:5173'>http://localhost:5173</a>");
});

// Iniciar servidor IMEDIATAMENTE (sem esperar DB)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em porta ${PORT}`);
    console.log(`📍 Host: 0.0.0.0`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
});

export default app;
