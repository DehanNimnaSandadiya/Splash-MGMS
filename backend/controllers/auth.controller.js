import User from '../models/user.model.js';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util.js';
import { createOTP, verifyOTP } from '../utils/otp.util.js';
import { verifyGoogleToken } from '../utils/oauth.util.js';
import { asyncHandler } from '../utils/errorHandler.util.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { AppError } from '../utils/errorHandler.util.js';
import bcrypt from 'bcryptjs';

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    passwordHash,
    name,
    role: 'user',
    isActive: true,
  });
  await user.save();

  await createOTP(email, 'verification');

  return sendSuccess(
    res,
    201,
    { userId: user._id, email: user.email },
    'User registered. Please verify OTP sent to your email.'
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOTP(email, otp, 'verification');

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = true;
  await user.save();

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return sendSuccess(
    res,
    200,
    {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    'Email verified successfully'
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  if (!user.passwordHash) {
    throw new AppError('Please use Google login for this account', 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return sendSuccess(
    res,
    200,
    {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    'Login successful'
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return sendSuccess(
      res,
      200,
      null,
      'If account exists, OTP has been sent to your email'
    );
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  await createOTP(email, 'password-reset');

  return sendSuccess(
    res,
    200,
    null,
    'Password reset OTP sent to your email'
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await verifyOTP(email, otp, 'password-reset');

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  return sendSuccess(res, 200, null, 'Password reset successfully');
});

export const googleOAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const googleUser = await verifyGoogleToken(idToken);

  let user = await User.findOne({
    $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }],
  });

  if (user) {
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }
    if (!user.googleId) {
      user.googleId = googleUser.googleId;
      await user.save();
    }
  } else {
    user = new User({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.googleId,
      role: 'user',
      isActive: true,
    });
    await user.save();
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  return sendSuccess(
    res,
    200,
    {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    'Google login successful'
  );
});

export const googleOAuthRedirect = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
    throw new AppError('Google OAuth not configured', 500);
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL ||
    `${backendUrl}/api/auth/google/callback`;
  const scope = 'openid email profile';
  const responseType = 'code';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

  res.redirect(googleAuthUrl);
});

export const googleOAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new AppError('Authorization code not provided', 400);
  }

  const { OAuth2Client } = await import('google-auth-library');
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL ||
    `${backendUrl}/api/auth/google/callback`;
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleUser = {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    googleId: payload.sub,
  };

  let user = await User.findOne({
    $or: [{ email: googleUser.email }, { googleId: googleUser.googleId }],
  });

  if (user) {
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }
    if (!user.googleId) {
      user.googleId = googleUser.googleId;
      await user.save();
    }
  } else {
    user = new User({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.googleId,
      role: 'user',
      isActive: true,
    });
    await user.save();
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const clientUrl = (process.env.CLIENT_URL || '').replace(/\/$/, '');
  if (!clientUrl) {
    throw new AppError('CLIENT_URL environment variable is not configured', 500);
  }

  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  const redirectUrl = `${clientUrl}/auth/callback?token=${token}&refreshToken=${refreshToken}&user=${encodeURIComponent(
    JSON.stringify(userData)
  )}`;

  res.redirect(redirectUrl);
});

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const { refreshToken: refreshTokenValue } = req.body;

  if (!refreshTokenValue) {
    throw new AppError('Refresh token is required', 400);
  }

  const decoded = verifyRefreshToken(refreshTokenValue);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  const newToken = generateToken(user);

  return sendSuccess(res, 200, { token: newToken }, 'Token refreshed');
});
