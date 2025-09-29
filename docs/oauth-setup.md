# OAuth Setup Guide

This guide explains how to configure Google and Discord OAuth for social authentication in the Gundam Card Game website.

## Prerequisites

- A deployed instance of the application with a public URL
- Access to Google Cloud Console (for Google OAuth)
- Access to Discord Developer Portal (for Discord OAuth)

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity Services

### 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Gundam Card Game"
   - User support email: Your email
   - App logo: (optional)
   - App domain: Your deployment domain
   - Authorized domains: Add your domain (e.g., `gundam-card-game.com`)
   - Developer contact: Your email
4. Add scopes: `email`, `profile`
5. Save and continue

### 3. Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Set name: "Gundam Card Game Web Client"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
6. Save and copy the Client ID and Client Secret

## Discord OAuth Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Enter name: "Gundam Card Game"
4. Save the application

### 2. Configure OAuth Settings

1. Navigate to "OAuth2" > "General"
2. Copy the Client ID and Client Secret
3. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/discord` (for development)
   - `https://your-domain.com/api/auth/callback/discord` (for production)
4. Under "OAuth2" > "URL Generator":
   - Select scopes: `identify`, `email`
   - Copy the generated URL for testing

## Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# Server-side OAuth (required for functionality)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Client-side OAuth (for UI button visibility)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_DISCORD_CLIENT_ID="your-discord-client-id"
```

**Important Notes:**
- The `NEXT_PUBLIC_*` variables should match their server-side counterparts
- Client secrets are never exposed to the browser
- Client IDs are safe to expose as they're public identifiers

## Testing OAuth Setup

### Development Testing

1. Start your development server: `npm run dev`
2. Navigate to `/auth/signin`
3. Verify that Google and/or Discord buttons appear
4. Test the authentication flow

### Production Testing

1. Deploy your application
2. Update OAuth redirect URIs to use your production domain
3. Test authentication on the live site

## Troubleshooting

### OAuth Buttons Not Appearing

- Check that environment variables are properly set
- Verify that `NEXT_PUBLIC_*` variables are configured
- Restart your development server after adding environment variables

### "OAuth Error" or "Invalid Client"

- Verify that redirect URIs match exactly (including protocol and trailing slashes)
- Check that client ID and secret are correct
- Ensure OAuth consent screen is properly configured

### "Email Not Verified" Error

- For Google: Check that email scope is included
- For Discord: Check that email scope is included
- Verify OAuth consent screen settings

## Security Best Practices

1. **Never commit secrets**: Use `.env` files and add them to `.gitignore`
2. **Rotate secrets regularly**: Update OAuth credentials periodically
3. **Limit redirect URIs**: Only add necessary redirect URLs
4. **Monitor usage**: Check OAuth application logs regularly
5. **Use HTTPS**: Always use HTTPS in production for OAuth redirects

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Discord OAuth Documentation](https://discord.com/developers/docs/topics/oauth2)
- [NextAuth.js OAuth Providers](https://next-auth.js.org/providers/)