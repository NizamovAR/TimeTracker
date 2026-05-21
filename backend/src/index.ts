import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import categoryRoutes from './routes/categoryRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//Роуты
app.use('/api/categories', categoryRoutes);

//Главная страница
app.get('/', (req, res) => {
    res.json({
        message: 'Time Trackes API is working',
        endpoints: {
            categories: '/api/categories'
        }
    });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});