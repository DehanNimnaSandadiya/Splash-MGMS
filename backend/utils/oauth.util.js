import { OAuth2Client } from 'google-auth-library';

const getOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
    return null;
  }
  return new OAuth2Client(clientId);
};

export const verifyGoogleToken = async (idToken) => {
  const client = getOAuthClient();
  if (!client) {
    throw new Error('Google OAuth not configured. Please set GOOGLE_CLIENT_ID.');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
    };
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

