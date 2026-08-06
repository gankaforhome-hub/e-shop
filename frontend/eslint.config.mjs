import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Розраховуємо абсолютний шлях до tsconfig.json, щоб пробіли в папках нічого не зламали
const tsconfigPath = resolve(__dirname, './tsconfig.json');

export default [
  // 1. Ігнорування файлів (глобально для всього воркспейсу)
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/out/',
      '**/build/**',
      '**/.DS_Store',
      '**/*.pem',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
    ],
  },
  js.configs.recommended,

  // 2. Спрощений конфіг для JS файлів налаштувань (postcss.config.js тощо)
  {
    files: ['*.js', '*.mjs', '*.cjs'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },

  // 3. Головний Flat Config для TypeScript / React коду додатка
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      boundaries: boundaries,
      prettier: prettierPlugin,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: tsconfigPath, // <--- Використовуємо безпечний абсолютний шлях
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigPath,
        },
      },
      'boundaries/mode': 'strict',
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**', capture: ['pages'] },
        { type: 'widgets', pattern: 'src/widgets/**', capture: ['widgets'] },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**', capture: ['shared'] },
      ],
    },
    rules: {
      // Базові правила JS та TS
      ...js.configs.recommended.rules,

      // Правила Next.js та React Hooks
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,

      // Твої налаштування
      'no-console': 'warn',
      eqeqeq: 'error',
      curly: ['error', 'all'],
      'no-else-return': 'error',

      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Порядок імпортів

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ['builtin'],
          warnOnUnassignedImports: true,
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            { pattern: 'next', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: 'next-intl', group: 'external', position: 'after' },
            { pattern: 'next-intl/**', group: 'external', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'after' },
            { pattern: '**/*.css', group: 'index', position: 'after' },
          ],
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',

      // Prettier інтеграція
      'prettier/prettier': 'error',

      // FSD Boundaries
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['pages', 'widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'pages',
              allow: ['widgets', 'features', 'entities', 'shared'],
              disallow: ['app'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD',
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
              disallow: ['app', 'pages'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD',
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
              disallow: ['app', 'pages', 'widgets'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD',
            },
            {
              from: 'entities',
              allow: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD',
            },
            {
              from: 'shared',
              allow: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features', 'entities'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD',
            },
          ],
        },
      ],

      // Вимикаємо конфліктні правила, покладаємося на TypeScript
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Розумне видалення невикористаних імпортів
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^I[A-Z]|^_', // ігнорує інтерфейси та змінні з підкресленням
          args: 'none',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
