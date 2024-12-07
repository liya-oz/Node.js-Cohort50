import express from 'express';
import { register, login, getProfile, logout } from './authController.js';
import { authenticate } from './authenticate.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/logout', logout);

export default router;
