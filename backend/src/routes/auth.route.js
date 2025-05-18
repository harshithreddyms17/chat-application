import express from 'express';
import { signup, login, logout, checkAuth  } from '../controllers/auth.controller.js';
import { signupValidation, validate, passwordChangeValidation } from '../middleware/auth.validation.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { updatePassword } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', signupValidation, validate, signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/check', protectedRoute, checkAuth);
router.put('/update-profile', protectedRoute, updateProfilePic);
router.put('/update-password', protectedRoute, passwordChangeValidation, validate, updatePassword);

export default router;