import nodemailer from 'nodemailer';

const createTransportFromEnv = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE;

  if (!emailUser || !emailPass) {
    return null;
  }

  try {
    if (emailService === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser.trim(),
          pass: emailPass.trim(),
        },
      });
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);

    return nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user: emailUser.trim(),
        pass: emailPass.trim(),
      },
    });
  } catch (error) {
    console.error('Failed to create email transport:', error.message);
    return null;
  }
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransportFromEnv();
  }
  return transporter;
};

export const sendOtpEmail = async (email, otp, type = 'verification') => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('Email transporter not configured. OTP:', otp);
    return true;
  }

  try {
    const subject =
      type === 'password-reset'
        ? 'Password Reset OTP'
        : 'Email Verification OTP';
    const title =
      type === 'password-reset' ? 'Password Reset' : 'Email Verification';
    const fromEmail = process.env.EMAIL_USER || 'noreply@mgms.com';

    const mailOptions = {
      from: fromEmail.trim(),
      to: email,
      subject,
      html: `
        <h2>${title}</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };
    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    console.warn('OTP for manual use:', otp);
    throw error;
  }
};

export const getEmailHealth = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailService = process.env.EMAIL_SERVICE;

  return {
    configured: !!(emailUser && emailPass),
    service: emailService || null,
    user: emailUser || null,
  };
};
