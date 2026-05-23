import { Request, Response } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcryptjs';
import {
    generateAccessToken, 
    generateRefreshToken, 
    verifyRefreshToken 
} from '../lib/jwt';
import { AppError } from '../lib/errors';
import { HTTP_STATUS } from '../lib/constants';


export const register = async (
    req: Request, 
    res: Response
) => {
    //Уже валидные данные
    const {
        email,
        password,
        name
    } = req.body;

    //Поиск сущетсвующего аккаунта
    const existingUser = await prisma.user.findUnique({ 
        where: { email }
    });
    if (existingUser) {
        //409 - конфликт данных 
        throw new AppError('Пользователь с таким email уже существует', HTTP_STATUS.CONFLICT);
    }

    //Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
        //возвращаем только нужные данные
        select: {
            id: true,
            email: true,
            name: true
        },
    });

    //создание jwt токена
    const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
    });
    const refreshToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        success: true,
        data: {
            user,
            accessToken,
        },
    });
};

export const login = async (
    req: Request, 
    res: Response
) => {

    //уже валидные данные
    const { 
        email, 
        password 
    } = req.body;

    //поиск существующего аккаунта
    const user = await prisma.user.findUnique({
        where: { email }
    });
    
    if(!user) {
        // 401 - Unauthorized
        throw new AppError('Неверный email или пароль', HTTP_STATUS.UNAUTHORIZED);
    }
    //Правильный ли пароль
    const isPaswordValid = await bcrypt.compare(password, user.password);
    
    if(!isPaswordValid) { 
        // 401 - Unauthorized
        throw new AppError('Неверный email или пароль', HTTP_STATUS.UNAUTHORIZED);
    }

    //создание jwt токена
    const accessToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
    });
    const refreshToken = generateAccessToken({ 
        userId: user.id, 
        email: user.email 
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        success: true, 
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            accessToken,
        },
    });
};

export const getMe = async (
    req: Request,
    res: Response
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user!.userId,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        },
    });

    if (!user) {
        throw new AppError('Пользователь не найден', HTTP_STATUS.NOT_FOUND)
    }

    res.json({
        success: true,
        data: user,
    });
};

export const refreshToken = async (
    req: Request,
    res: Response
) => {
    try 
    {
        const refreshTokenFromCookie = req.cookies?.refreshToken;

        if (!refreshTokenFromCookie) {
            throw new AppError('Refresh token не предоставлен', HTTP_STATUS.BAD_REQUEST);
        }

        const decoded = verifyRefreshToken(refreshTokenFromCookie);

        const user = await prisma.user.findUnique({
            where: { 
                id: decoded.userId 
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        if (!user) {
            throw new AppError('Пользователь не найден', HTTP_STATUS.NOT_FOUND);
        }

        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email
        });
        const newRefreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email
        })

        res.cookie('refreshToken', newRefreshToken , {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                user,
            },
        });
    } catch (error) {
        res.cookie('refreshToken', '', {
            httpOnly: true,
            maxAge: 0
        });

        if (error instanceof Error) {
            throw new AppError('Сессия истекла, пожалуйтса войдите заново', HTTP_STATUS.UNAUTHORIZED);
        }
        throw error;
    }
};

export const logout = async (
    req: Request,
    res: Response
) => { 
    res.cookie('refreshToken', '', {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
    });

    res.json({
        success: true,
        message: 'Успешный выход из системы',
    });
};