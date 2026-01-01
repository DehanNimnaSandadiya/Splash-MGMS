import express from 'express';
import {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  googleOAuth,
  googleOAuthRedirect,
  googleOAuthCallback,
  refreshTokenHandler,
} from '../controllers/auth.controller.js';
import {
  validate,
  registerValidation,
  loginValidation,
  otpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../utils/validation.util.js';
import { otpRateLimiter, authRateLimiter } from '../utils/rateLimit.util.js';
import { getEmailHealth } from '../utils/email.util.js';

const router = express.Router();

if (process.env.NODE_ENV === 'development') {
  router.get('/_email-health', (req, res) => {
    const health = getEmailHealth();
    res.json(health);
  });
}

router.post('/register', validate(registerValidation), register);
router.post('/verify-otp', otpRateLimiter, validate(otpValidation), verifyEmail);
router.post('/login', authRateLimiter, validate(loginValidation), login);
router.post(
  '/forgot-password',
  otpRateLimiter,
  validate(forgotPasswordValidation),
  forgotPassword
);
router.post(
  '/reset-password',
  otpRateLimiter,
  validate(resetPasswordValidation),
  resetPassword
);
router.get('/google', googleOAuthRedirect);
router.get('/google/callback', googleOAuthCallback);
router.post('/google', authRateLimiter, googleOAuth);
router.post('/refresh', refreshTokenHandler);

export default router;

