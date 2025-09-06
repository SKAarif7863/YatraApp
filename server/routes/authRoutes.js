import { Router } from 'express';
import passport from 'passport';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';
import { register, login, refresh, logout, me, googleAuth, googleCallback, firebaseAuth } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

// Firebase-based Google sign-in (client obtains Firebase idToken and posts it here)
router.post('/firebase', firebaseAuth);

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), googleCallback);

export default router;
