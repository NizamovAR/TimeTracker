import { Router } from 'express';
import { validate } from '../lib/validate';
import { 
    register, 
    login,
    refreshToken,
    logout,
    getMe 
} from '../controllers/authController';

import { registerSchema, loginSchema } from '../lib/Validations/auth';
import { protect } from '../middleware/protect';

const router = Router ();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;

