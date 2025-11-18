import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  // TypeScript ESLint recommended configs
  ...tseslint.configs.recommended,

  // React plugin configuration
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Custom rules configuration
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow for config files

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

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import Rules (basic)
      'no-duplicate-imports': 'error',

      // Code Style Rules (basic)
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],

      // Complexity Rules (pragmatic settings for real-world applications)
      complexity: ['warn', 15],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 500],
      'max-lines-per-function': ['warn', 100],
      'max-params': ['warn', 6],
      'max-statements': ['warn', 30],

      // File Size Rules (custom)
      'max-len': [
        'warn',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
    },
  },

  // Test file overrides
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-utils.tsx',
      '**/test-utils.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: false, // Don't use TypeScript project parsing for test files
      },
    },
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-lines': 'off', // Test files can be long
    },
  },

  // Config file overrides
  {
    files: [
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
      'jest.setup.js',
    ],
    languageOptions: {
      parserOptions: {
        project: false, // Don't use TypeScript project parsing for config files
      },
    },
    rules: {
      // Relax rules for config files
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Service worker overrides
  {
    files: ['public/sw.js', 'public/sw-*.js', '**/service-worker.js'],
    languageOptions: {
      parserOptions: {
        project: false, // Don't use TypeScript parsing for service workers
      },
    },
    rules: {
      // Relax rules for service workers
      'no-console': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },

  // Legal and marketing content pages - legitimate long-form content
  {
    files: [
      '**/TermsOfService.tsx',
      '**/PrivacyNotice.tsx',
      '**/CookieNotice.tsx',
      '**/LegalComplianceFooter.tsx',
      '**/BandaiNamcoAttribution.tsx',
      '**/NonAffiliationStatement.tsx',
      'src/app/page.tsx',
      'src/app/demo/page.tsx',
      'src/app/offline/page.tsx',
    ],
    rules: {
      // These files contain legitimate long-form content
      'max-lines-per-function': 'off',
      'max-statements': 'off',
    },
  },

  // Page components, forms, and complex UI - raised thresholds
  {
    files: [
      // Page-level components
      '**/*Page.tsx',
      '**/*Page.ts',
      '**/layout.tsx',

      // Complex forms
      '**/*Form.tsx',
      '**/*Modal.tsx',

      // Complex interactive components
      '**/DeckBuilder*.tsx',
      '**/CollectionManager*.tsx',
      '**/InfiniteScroll*.tsx',
      '**/DraggableCard*.tsx',
      '**/AdvancedFilters*.tsx',
      '**/CardSearch*.tsx',
    ],
    rules: {
      // Raised thresholds for legitimate UI complexity
      'max-lines-per-function': ['warn', 150],
      complexity: ['warn', 25],
      'max-statements': ['warn', 50],
    },
  },

  // Ignore patterns
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
      'docs/**',
    ],
  },
];

export default eslintConfig;
