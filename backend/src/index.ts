import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import categoryRoutes from './routes/categoryRoutes';
import timeEntryRoutes from './routes/timeEntryRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); //Заголовки безопасности
app.use(cors());
app.use(morgan('dev')); //логи запросов
app.use(express.json({limit: '1mb'})); //парсинг JSON с лимитом в 1мб

//Роуты
app.use('/api/categories', categoryRoutes);
app.use('/api/timeEntry', timeEntryRoutes);

//Главная страница
app.get('/', (req, res) => {
    res.json({
        message: 'Time Trackes API is working',
        endpoints: {
            categories: '/api/categories'
        }
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});