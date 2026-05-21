import { Router } from 'express';
import { validate } from '../lib/validate';
import { register, login } from '../controllers/authController';
import { registerSchema, loginSchema } from '../lib/Validations/auth';

const router = Router ();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;

