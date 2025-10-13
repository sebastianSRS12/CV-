import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'Missing idToken' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    // Verify required claims
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp! < now) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
      return res.status(401).json({ error: 'Invalid issuer' });
    }
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ error: 'Invalid audience' });
    }

    // Return verified user info
    const { sub, email, name, picture } = payload;
    return res.status(200).json({
      userId: sub,
      email,
      name,
      picture,
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}