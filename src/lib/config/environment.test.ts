// Test file for environment configuration
import {
  env,
  isDevelopment,
  isProduction,
  isTest,
  corsOrigins,
  isFeatureEnabled,
} from './environment';

describe('Environment Configuration', () => {
  describe('Environment Detection', () => {
    it('should have environment detection functions', () => {
      expect(typeof isDevelopment).toBe('boolean');
      expect(typeof isProduction).toBe('boolean');
      expect(typeof isTest).toBe('boolean');
    });
  });

  describe('CORS Origins', () => {
    it('should have corsOrigins function', () => {
      expect(Array.isArray(corsOrigins)).toBe(true);
      expect(corsOrigins.length).toBeGreaterThan(0);
    });
  });

  describe('Feature Flags', () => {
    it('should have isFeatureEnabled function', () => {
      expect(typeof isFeatureEnabled).toBe('function');
    });

    it('should return boolean for feature flags', () => {
      expect(typeof isFeatureEnabled('DEBUG')).toBe('boolean');
      expect(typeof isFeatureEnabled('ENABLE_API_DOCS')).toBe('boolean');
    });
  });

  describe('Environment Variables', () => {
    it('should have env object with required properties', () => {
      expect(typeof env).toBe('object');
      expect(env).toHaveProperty('NODE_ENV');
      expect(env).toHaveProperty('NEXT_PUBLIC_APP_URL');
      expect(env).toHaveProperty('NEXT_PUBLIC_APP_NAME');
      expect(env).toHaveProperty('UPLOAD_DIR');
    });

    it('should have numeric properties', () => {
      expect(typeof env.DATABASE_POOL_MIN).toBe('number');
      expect(typeof env.DATABASE_POOL_MAX).toBe('number');
      expect(typeof env.RATE_LIMIT_MAX).toBe('number');
    });

    it('should have boolean properties', () => {
      expect(typeof env.DEBUG).toBe('boolean');
      expect(typeof env.ENABLE_API_DOCS).toBe('boolean');
    });

    it('should have string properties', () => {
      expect(typeof env.NEXT_PUBLIC_APP_URL).toBe('string');
      expect(typeof env.NEXT_PUBLIC_APP_NAME).toBe('string');
      expect(typeof env.UPLOAD_DIR).toBe('string');
    });
  });

  describe('Module Exports', () => {
    it('should export all required functions and objects', () => {
      expect(env).toBeDefined();
      expect(isDevelopment).toBeDefined();
      expect(isProduction).toBeDefined();
      expect(isTest).toBeDefined();
      expect(corsOrigins).toBeDefined();
      expect(isFeatureEnabled).toBeDefined();
    });
  });
});
