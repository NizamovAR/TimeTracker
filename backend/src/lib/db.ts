import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';   
import dotenv from 'dotenv';

dotenv.config();

// Создаём пул соединений
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Создаём adapter
const adapter = new PrismaPg(pool);

// Создаём Prisma Client с adapter
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;