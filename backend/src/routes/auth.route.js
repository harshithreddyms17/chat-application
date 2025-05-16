import express, { application } from 'express';
import { signup, login, logout  } from '../controllers/auth.controller.js';
import { signupValidation, validate } from '../middleware/auth.validation.js';
const router = express.Router();

router.post('/signup', signupValidation, validate, signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;