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
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:boundaries/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    plugins: ['@typescript-eslint', 'import', 'boundaries', 'prettier'],
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'boundaries/mode': 'strict',
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'src/app/**',
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
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
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
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
        },
      ],
      // '@typescript-eslint/consistent-type-imports': [
      //   'error',
      //   {
      //     prefer: 'type-imports',
      //     fixStyle: 'inline-type-imports',
      //   },
      // ],
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
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
              disallow: ['app'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
              disallow: ['app', 'widgets'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'entities',
              allow: ['shared'],
              disallow: ['app', 'widgets', 'features'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
            {
              from: 'shared',
              allow: ['shared'],
              disallow: ['app', 'widgets', 'features', 'entities'],
              message:
                '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by the Feature-Sliced Design (FSD)',
            },
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
