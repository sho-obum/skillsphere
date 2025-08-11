import { Router } from 'express';
import { signup, login, refresh, logout } from '../controllers/authController.js';
import { signupRules, loginRules } from '../validators/authRules.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/signup', signupRules, validate, signup);
router.post('/login',  loginRules,  validate, login);
router.post('/refresh', refresh);
router.post('/logout',  logout);

export default router;
