import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Code Quality Rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off', // Use TypeScript version
      
      // TypeScript Rules
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // React Rules
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'error',
      'react/prop-types': 'off', // Using TypeScript
      'react/react-in-jsx-scope': 'off', // Next.js handles this
      'react/require-render-return': 'error',
      
      // Next.js Rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'error',
      '@next/next/no-typos': 'error',
      '@next/next/no-assign-module-variable': 'error',
      
      // Import Rules (basic)
      'no-duplicate-imports': 'error',
      
      // Code Style Rules (basic)
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      
      // Complexity Rules (pragmatic settings for real-world applications)
      'complexity': ['warn', 15], // Increased from 10 - complex business logic exists
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 500], // Increased from 300 - service files need space
      'max-lines-per-function': ['warn', 100], // Increased from 50 - business logic is complex
      'max-params': ['warn', 6], // Increased from 4 - sometimes needed for services
      'max-statements': ['warn', 30], // Increased from 20 - complex operations need more statements

      // File Size Rules (custom)
      'max-len': ['warn', {
        code: 120, // Increased from 100 - more reasonable for modern development
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true // Added - allow longer comments for documentation
      }]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off'
    }
  },
  {
    files: ['**/*.config.js', '**/*.config.mjs', '**/*.config.ts'],
    rules: {
      // Relax rules for config files
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-commonjs': 'off'
    }
  },
  {
    files: ['public/sw.js', 'public/sw-*.js', '**/service-worker.js'],
    rules: {
      // Relax rules for service workers - they need console for debugging and are inherently complex
      'no-console': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'complexity': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      'scripts/**',
      'docs/**'
    ],
  },
];

export default eslintConfig;
