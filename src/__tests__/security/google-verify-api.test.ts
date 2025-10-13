import { createMocks } from 'node-mocks-http';
import handler from '@/api/auth/google/verify';
import { OAuth2Client } from 'google-auth-library';

jest.mock('google-auth-library', () => {
  const mOAuth2Client = {
    verifyIdToken: jest.fn(),
  };
  return { OAuth2Client: jest.fn(() => mOAuth2Client) };
});

const mockPayload = {
  sub: '1234567890',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'http://example.com/avatar.png',
  iss: 'accounts.google.com',
  aud: 'test-client-id',
  exp: Math.floor(Date.now() / 1000) + 3600,
};

describe('Google token verification API', () => {
  it('returns 200 with user info for valid token', async () => {
    // Mock the verifyIdToken method to return a ticket with our payload
    const mockVerify = (OAuth2Client as jest.Mock).mock.instances[0].verifyIdToken;
    mockVerify.mockResolvedValue({
      getPayload: () => mockPayload,
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { idToken: 'valid-token' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toMatchObject({
      userId: mockPayload.sub,
      email: mockPayload.email,
      name: mockPayload.name,
      picture: mockPayload.picture,
    });
  });

  it('returns 400 when idToken is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 405 for non‑POST methods', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});