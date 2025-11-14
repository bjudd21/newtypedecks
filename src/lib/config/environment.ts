// Environment configuration and validation
interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_APP_NAME: string;

  // Database
  DATABASE_URL: string;
  DATABASE_POOL_MIN?: number;
  DATABASE_POOL_MAX?: number;

  // Redis
  REDIS_URL: string;
  REDIS_PASSWORD?: string;

  // Authentication
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;

  // File Storage
  UPLOAD_DIR: string;
  VERCEL_BLOB_READ_WRITE_TOKEN?: string;
  CLOUDINARY_URL?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;

  // Email
  EMAIL_SERVER_HOST?: string;
  EMAIL_SERVER_PORT?: number;
  EMAIL_SERVER_USER?: string;
  EMAIL_SERVER_PASSWORD?: string;
  EMAIL_FROM?: string;

  // Social Login
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  DISCORD_CLIENT_ID?: string;
  DISCORD_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;

  // CDN and Image Optimization
  CDN_PROVIDER?: string;
  CDN_BASE_URL?: string;
  CDN_API_KEY?: string;
  CDN_API_SECRET?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  IMAGEKIT_ID?: string;
  IMAGEKIT_PRIVATE_KEY?: string;
  IMAGEKIT_PUBLIC_KEY?: string;

  // Analytics
  NEXT_PUBLIC_GA_TRACKING_ID?: string;
  SENTRY_DSN?: string;
  SENTRY_ORG?: string;
  SENTRY_PROJECT?: string;

  // Rate Limiting
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_WINDOW_MS: number;

  // Security
  CORS_ORIGINS: string;
  SESSION_MAX_AGE: number;
  SESSION_UPDATE_AGE: number;

  // Development
  DEBUG: boolean;
  ENABLE_API_DOCS: boolean;

  // Testing
  TEST_DATABASE_URL?: string;
  TEST_REDIS_URL?: string;

  // Docker
  COMPOSE_PROJECT_NAME: string;
  DOCKER_NETWORK: string;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    // During build time or in non-production environments, provide defaults
    // Only throw errors in actual production runtime
    const isProductionRuntime =
      process.env.NODE_ENV === 'production' &&
      typeof window === 'undefined' &&
      !process.env.NEXT_PHASE; // Not during build phase

    if (!isProductionRuntime) {
      // Development, test, or build time - use defaults
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Warning: Environment variable ${key} is not set, using default`
        );
      }
      return getDefaultValue(key);
    }

    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || fallback || '';
}

/**
 * Get default values for development
 */
function getDefaultValue(key: string): string {
  const defaults: Record<string, string> = {
    DATABASE_URL:
      'postgresql://gundam_user:gundam_password@localhost:5432/gundam_card_game',
    REDIS_URL: 'redis://localhost:6379',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'dev-secret-key-please-change-in-production',
  };
  return defaults[key] || '';
}

/**
 * Get environment variable as number
 */
function getEnvNumber(key: string, fallback?: number): number {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  const num = value ? parseInt(value, 10) : fallback!;
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return num;
}

/**
 * Get environment variable as boolean
 */
function getEnvBoolean(key: string, fallback?: boolean): boolean {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  if (!value) return fallback || false;
  return value.toLowerCase() === 'true';
}

/**
 * Validate required environment variables
 */
function validateEnvironment(): void {
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Environment configuration object
 */
export const env: EnvironmentConfig = {
  // Application
  NODE_ENV:
    (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
  NEXT_PUBLIC_APP_URL: getEnvVar(
    'NEXT_PUBLIC_APP_URL',
    'http://localhost:3000'
  ),
  NEXT_PUBLIC_APP_NAME: getEnvVar(
    'NEXT_PUBLIC_APP_NAME',
    'Gundam Card Game Database'
  ),

  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  DATABASE_POOL_MIN: getEnvNumber('DATABASE_POOL_MIN', 2),
  DATABASE_POOL_MAX: getEnvNumber('DATABASE_POOL_MAX', 10),

  // Redis
  REDIS_URL: getEnvVar('REDIS_URL'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Authentication
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET'),

  // File Storage
  UPLOAD_DIR: getEnvVar('UPLOAD_DIR', './uploads'),
  VERCEL_BLOB_READ_WRITE_TOKEN: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  // Email
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT
    ? parseInt(process.env.EMAIL_SERVER_PORT, 10)
    : undefined,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // Social Login
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // CDN and Image Optimization
  CDN_PROVIDER: process.env.CDN_PROVIDER,
  CDN_BASE_URL: process.env.CDN_BASE_URL,
  CDN_API_KEY: process.env.CDN_API_KEY,
  CDN_API_SECRET: process.env.CDN_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  IMAGEKIT_ID: process.env.IMAGEKIT_ID,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,

  // Analytics
  NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,

  // Rate Limiting
  RATE_LIMIT_MAX: getEnvNumber('RATE_LIMIT_MAX', 100),
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),

  // Security
  CORS_ORIGINS: getEnvVar(
    'CORS_ORIGINS',
    'http://localhost:3000,http://localhost:3001'
  ),
  SESSION_MAX_AGE: getEnvNumber('SESSION_MAX_AGE', 2592000),
  SESSION_UPDATE_AGE: getEnvNumber('SESSION_UPDATE_AGE', 86400),

  // Development
  DEBUG: getEnvBoolean('DEBUG', false),
  ENABLE_API_DOCS: getEnvBoolean('ENABLE_API_DOCS', true),

  // Testing
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  TEST_REDIS_URL: process.env.TEST_REDIS_URL,

  // Docker
  COMPOSE_PROJECT_NAME: getEnvVar('COMPOSE_PROJECT_NAME', 'gundam-card-game'),
  DOCKER_NETWORK: getEnvVar('DOCKER_NETWORK', 'gundam-network'),
};

/**
 * Validate environment on module load (only in production runtime)
 * Skip validation in development, test, and during build phase
 */
if (env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
  validateEnvironment();
}

/**
 * Check if running in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get CORS origins as array
 */
export const corsOrigins = env.CORS_ORIGINS.split(',').map((origin) =>
  origin.trim()
);

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (
  feature: keyof Pick<EnvironmentConfig, 'DEBUG' | 'ENABLE_API_DOCS'>
): boolean => {
  return env[feature];
};

export default env;
