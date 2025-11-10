/**
 * OAuth provider configuration utilities
 */

// Since OAuth client secrets should not be exposed to the client,
// we need to determine OAuth availability through other means
export interface OAuthConfig {
  google: {
    enabled: boolean;
    clientId?: string;
  };
  discord: {
    enabled: boolean;
    clientId?: string;
  };
}

/**
 * Get OAuth configuration that's safe for client-side use
 * This only exposes client IDs, not secrets
 */
export function getOAuthConfig(): OAuthConfig {
  return {
    google: {
      enabled: !!(typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        : process.env.GOOGLE_CLIENT_ID),
      clientId:
        typeof window !== 'undefined'
          ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
          : undefined,
    },
    discord: {
      enabled: !!(typeof window !== 'undefined'
        ? process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
        : process.env.DISCORD_CLIENT_ID),
      clientId:
        typeof window !== 'undefined'
          ? process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
          : undefined,
    },
  };
}

/**
 * Check if Google OAuth is enabled
 */
export function isGoogleOAuthEnabled(): boolean {
  return getOAuthConfig().google.enabled;
}

/**
 * Check if Discord OAuth is enabled
 */
export function isDiscordOAuthEnabled(): boolean {
  return getOAuthConfig().discord.enabled;
}

/**
 * Check if any OAuth provider is enabled
 */
export function isOAuthEnabled(): boolean {
  const config = getOAuthConfig();
  return config.google.enabled || config.discord.enabled;
}
