import OTP from '../models/otp.model.js';
import { sendOtpEmail } from './email.util.js';
import { AppError } from './errorHandler.util.js';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTP = async (email, type) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email, type },
    {
      email,
      otp,
      type,
      expiresAt,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp, type);
  return otp;
};

export const verifyOTP = async (email, otp, type) => {
  const otpRecord = await OTP.findOne({ email, type });

  if (!otpRecord) {
    throw new AppError('OTP not found or expired', 400);
  }

  if (otpRecord.attempts >= 5) {
    throw new AppError('Too many failed attempts. Please request a new OTP', 429);
  }

  if (new Date() > otpRecord.expiresAt) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new AppError('OTP has expired', 400);
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AppError('Invalid OTP', 400);
  }

  await OTP.deleteOne({ _id: otpRecord._id });
  return true;
};

