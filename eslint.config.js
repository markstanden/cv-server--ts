import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
    {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: { ...globals.browser },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      
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
      
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  }, 
  
  {
    files: ['netlify/functions/**/*.{ts,js}', 'src/node/**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
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
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  prettier,
];
