import { Request, Response, NextFunction } from 'express';
import { success, ZodError } from 'zod';
import { AppError } from '../lib/errors';

export const errorHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    let error = { ...err };
    error.message = err.message;

    //Обработка ошибок Zod
    if (err instanceof ZodError) {
        const message = err.issues
        .map((e) => `${e.path.join('.')} - ${e.message}`)
        .join(', ');
        
        error = new AppError(`Ошибка валидации: ${message}`, 400);
    }

    if (err.code === 'P2002') {
        error = new AppError('Запись с таким значением уже существует', 409); 
    }

    res.status(error.statusCode || 500).json({
        success: false, 
        error: error.message || 'Внутренняя ошибка сервера',
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            issues: err instanceof ZodError ? err.issues : undefined,
        }),
    });
};
