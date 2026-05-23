import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { AppError } from "../lib/errors";
import { HTTP_STATUS } from "../lib/constants";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader?.startsWith('Bearer ')) {
            throw new AppError('Доступ запрещен. Токен не предоставлен.', HTTP_STATUS.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};