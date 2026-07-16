import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:boundaries/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    plugins: ['@typescript-eslint', 'import', 'boundaries', 'prettier'],

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'boundaries/mode': 'strict',
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'src/app/**',
        },
        {
          type: 'pages',
          pattern: 'src/pages/**',
          capture: ['pages'],
        },
        {
          type: 'widgets',
          pattern: 'src/widgets/**',
          capture: ['widgets'],
        },
        {
          type: 'features',
          pattern: 'src/features/**',
        },
        {
          type: 'entities',
          pattern: 'src/entities/**',
        },
        {
          type: 'shared',
          pattern: 'src/shared/**',
          capture: ['shared'],
        },
      ],
    },
    rules: {
      // 'no-console': 'warn',
      eqeqeq: 'error',
      curly: ['error', 'all'],
      'no-else-return': 'warn',
      // "tailwindcss/classnames-order": [
      //   "error",
      //   {
      //     order: [
      //       "layout",
      //       "spacing",
      //       "sizing",
      //       "typography",
      //       "background",
      //       "borders",
      //       "effects",
      //       "visibility",
      //     ],
      //   },
      // ],
      // 'prettier/prettier': ['error'],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '**/*.css',
              group: 'index',
              position: 'after',
            },
            {
              pattern: '**/*.scss',
              group: 'index',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external'],
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
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          // message:
          //   '❌ ${dependency.type} are not allowed to be imported into ${file.type}',
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
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
              disallow: ['app', 'pages'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
              disallow: ['app', 'pages', 'widgets'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'entities',
              allow: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'shared',
              allow: ['shared'],
              disallow: ['app', 'pages', 'widgets', 'features', 'entities'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
          ],
        },
      ],
    },

    ignorePatterns: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.next/',
      '**/out/',
      '**/build',
      '**/.DS_Store',
      '**/*.pem',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',
    ],
  }),
  {
    rules: {
      'no-console': 'warn',
      eqeqeq: 'warn',
      // curly: 'warn',
      'no-else-return': 'warn',
    },
  },
];

export default eslintConfig;
