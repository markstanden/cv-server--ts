import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,
  
  // Prettier config (must be last to override other formatting rules)
  prettier,
  
  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // General rules
      'no-console': 'warn',
      'curly': ['error', 'all'],
      'no-tabs': [
        'error',
        {
          allowIndentationTabs: true,
        },
      ],
      'lines-around-comment': [
        'warn',
        {
          beforeLineComment: true,
          beforeBlockComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      
      // Import rules - using recommended import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
  
  // JavaScript files configuration
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Element: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-console': 'warn',
      'curly': ['error', 'all'],
      'no-tabs': [
        'error',
        {
          allowIndentationTabs: true,
        },
      ],
      'lines-around-comment': [
        'warn',
        {
          beforeLineComment: true,
          beforeBlockComment: true,
          allowBlockStart: true,
          allowClassStart: true,
          allowObjectStart: true,
          allowArrayStart: true,
        },
      ],
      // Import rules - using recommended import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },
];
