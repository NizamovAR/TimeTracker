import { z } from 'zod';

export const registerSchema = z.object({
    email: z
    .string()
    .email('Неверный формат email')
    .toLowerCase()
    .trim(),

    password: z
    .string()
    .min(6, 'Минимальное количество символов для пароля - 6')
    .max(50, 'Максимальное количество символов для пароля - 50'),
    
    name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное').
    optional(),
});

export const loginSchema = z.object({
    email: z
    .string()
    .email('Неверный формат email')
    .toLowerCase()
    .trim(),

    password: z
    .string()
    .min(1, 'Введите пароль'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;