import {z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';

export const validate = (schema: z.ZodSchema) => {
    return (
        req: Request, 
        res: Response, 
        next: NextFunction
    ) => {
        try {
            const validated = schema.parse({
                ...req.body,
                ...req.params,
                ...req.query,
            });

            req.body = validated; // замена на валдиные данные
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                next(error);
            } 
            else {
                next(new AppError('Ошибка валидации', 400));
            }
        }
    };
};