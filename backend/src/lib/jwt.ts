import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.JWT_SECRET || 'dev-refresh';

export interface JwtPayload {
    userId: string;
    email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '15m'
    });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '7d'
    });
};

export const verifyAccessToken = (token: string) : JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token : string) : JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};