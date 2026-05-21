import  { z } from 'zod';

export const cuidSchema = z
    .string()
    .min(1, 'ID обязателен')
    .regex(/^[c][a-z0-9]{24}$/, 'Некорректный CUID');

export const isoDateSchema = z
    .string()
    .datetime({ message: 'Дата должна быть в формате ISO' })
    .refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
    }, 'Некорретная дата');

