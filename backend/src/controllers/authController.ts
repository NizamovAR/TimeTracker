import { Request, Response } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/jwt';
import { AppError } from '../lib/errors';
import { success } from 'zod';

export const register = async (req: Request, res: Response) => {
    const {
        email,
        password,
        name
    } = req.body;

    const existindUser = await prisma.user.findUnique({ 
        where: { email }
    });
    if (existindUser) {
        throw new AppError('Пользователь с таким email уже существует', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
        select: {
            id: true,
            email: true,
            name: true
        },
    });

    const token = generateToken({ 
        userId: user.id, 
        email: user.email 
    });

    res.status(201).json({
        success: true,
        data: {
            user,
            token,
        },
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {email}
    });
    
    if(!user) {
        throw new AppError('Неверный email или пароль', 401);
    }
    
    const isPaswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPaswordValid) { 
        throw new AppError('Неверный email или пароль', 401);
    }

    const token = generateToken({
        userId: user.id,
        email: user.email
    });

    res.json({
        success: true, 
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token,
        },
    });
};