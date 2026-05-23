import { JwtPayload } from '../lib/jwt';

// Расширяем тип Request в Express,
// добавляя поле user с данными из JWT.
// Это позволяет TypeScript понимать req.user
// после прохождения auth middleware.
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export {};