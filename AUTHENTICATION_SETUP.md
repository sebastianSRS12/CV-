# Authentication Setup Guide

This guide will help you set up authentication for your CV Builder application.

## Prerequisites

1. Node.js (v14 or later)
2. npm or yarn
3. Google Cloud Platform account (for Google OAuth)
4. GitHub account (for GitHub OAuth)

## Setup Instructions

### 1. Install Dependencies

Make sure you have all the required dependencies installed:

```bash
npm install next-auth @auth/prisma-adapter @prisma/client
```

### 2. Set Up Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

### 3. Configure OAuth Providers

#### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
7. Save and note your Client ID and Client Secret

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following details:
   - Application name: `CV Builder`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Generate a new client secret and note both the Client ID and Client Secret

### 4. Run the Setup Script (Alternative)

Alternatively, you can run the setup script to guide you through the process:

```bash
node setup-auth.js
```

This will create/update your `.env` file with the provided credentials.

### 5. Start the Development Server

After setting up the environment variables, start the development server:

```bash
npm run dev
```

### 6. Test the Authentication

1. Open your browser and go to `http://localhost:3000/auth/signin`
2. You should see sign-in options for Google and GitHub
3. Test both authentication methods

## Troubleshooting

### Common Issues

1. **Invalid OAuth Credentials**
   - Double-check your client ID and secret
   - Ensure the redirect URIs match exactly
   - Make sure the OAuth consent screen is configured correctly

2. **CSRF Token Errors**
   - Ensure `NEXTAUTH_SECRET` is set and is a strong random string
   - Verify that `NEXTAUTH_URL` is correctly set

3. **Redirect Loop**
   - Clear your browser cookies for the application
   - Check the `pages` configuration in `auth.ts`

4. **Environment Variables Not Loading**
   - Make sure the `.env` file is in the root directory
   - Restart your development server after making changes

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Restrict OAuth credentials to specific domains in production
- Regularly rotate your OAuth client secrets

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup Guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
