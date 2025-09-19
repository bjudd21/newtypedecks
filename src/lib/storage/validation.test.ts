// Test file for file validation utilities
import {
  validateFile,
  validateImageDimensions,
  generateSafeFilename,
  getFileExtension,
  formatFileSize,
  SUPPORTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from './validation';

// Mock File object for testing
const createMockFile = (name: string, type: string, size: number): File => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('File Validation', () => {
  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 1024 * 1024); // 1MB
      const result = validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject unsupported file types', () => {
      const file = createMockFile('test.txt', 'text/plain', 1024);
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Unsupported file type');
    });

    it('should reject files that are too large', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', MAX_FILE_SIZE + 1);
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('File size too large');
    });

    it('should reject empty files', () => {
      const file = createMockFile('test.jpg', 'image/jpeg', 0);
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('File is empty');
    });

    it('should accept all supported image types', () => {
      SUPPORTED_IMAGE_TYPES.forEach((type) => {
        const file = createMockFile('test.jpg', type, 1024);
        const result = validateFile(file);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateImageDimensions', () => {
    it('should validate correct dimensions', () => {
      const result = validateImageDimensions(800, 600);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject width that is too small', () => {
      const result = validateImageDimensions(50, 600);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('width must be between');
    });

    it('should reject width that is too large', () => {
      const result = validateImageDimensions(3000, 600);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('width must be between');
    });

    it('should reject height that is too small', () => {
      const result = validateImageDimensions(800, 50);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('height must be between');
    });

    it('should reject height that is too large', () => {
      const result = validateImageDimensions(800, 3000);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toContain('height must be between');
    });
  });

  describe('generateSafeFilename', () => {
    it('should generate safe filename from simple name', () => {
      const result = generateSafeFilename('test.jpg');
      expect(result).toMatch(/^test-\d+$/);
    });

    it('should sanitize special characters', () => {
      const result = generateSafeFilename('test@#$%file.jpg');
      expect(result).toMatch(/^test-file-\d+$/);
    });

    it('should handle spaces', () => {
      const result = generateSafeFilename('test file.jpg');
      expect(result).toMatch(/^test-file-\d+$/);
    });

    it('should add prefix when provided', () => {
      const result = generateSafeFilename('test.jpg', 'card');
      expect(result).toMatch(/^card-test-\d+$/);
    });

    it('should handle empty name', () => {
      const result = generateSafeFilename('');
      expect(result).toMatch(/^-\d+$/);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg');
      expect(getFileExtension('test.PNG')).toBe('png');
      expect(getFileExtension('test.webp')).toBe('webp');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('test')).toBe('');
    });

    it('should handle empty filename', () => {
      expect(getFileExtension('')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });
  });
});
