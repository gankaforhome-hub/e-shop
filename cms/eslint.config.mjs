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

const __dirname = dirname(fileURLToPath(import.meta.url));

// Absolute path, so spaces in the workspace path don't break the resolver
const tsconfigPath = resolve(__dirname, './tsconfig.json');

const fsdMessage =
  '❌"${dependency.type}" are not allowed to be imported into "${file.type}" by FSD';

// Typed, locale-aware wrappers replace these imports (see AGENTS.md → CMS)
const restrictedImports = [
  {
    name: 'next/link',
    message: 'Use AppLink from @/shared/ui/app-link (typed, locale-aware).',
  },
  {
    name: 'next/image',
    message:
      'Add a typed media primitive to @/shared/ui instead of using next/image directly.',
  },
  {
    name: 'next/navigation',
    importNames: ['redirect', 'permanentRedirect', 'usePathname', 'useRouter'],
    message: 'Use the locale-aware helpers from @/shared/i18n/navigation.',
  },
];

const lucideRestriction = {
  name: 'lucide-react',
  message:
    'Use <Icon name="…" /> from @/shared/ui/icon; register new icons in ICON_MAP.',
};

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/coverage/**',
      'next-env.d.ts',
    ],
  },
  js.configs.recommended,

  // Config files (postcss.config.mjs, eslint.config.mjs)
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

  // TypeScript / React application code
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
        project: tsconfigPath,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigPath,
        },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'widgets', pattern: 'src/widgets/**', capture: ['widgets'] },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**', capture: ['shared'] },
      ],
    },
    rules: {
      ...js.configs.recommended.rules,

      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,

      'no-console': 'warn',
      eqeqeq: 'error',
      curly: ['error', 'all'],
      'no-else-return': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

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

      'no-restricted-imports': [
        'error',
        { paths: [...restrictedImports, lucideRestriction] },
      ],

      'prettier/prettier': 'error',

      // FSD: app → widgets → features → entities → shared
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'app',
              allow: ['widgets', 'features', 'entities', 'shared'],
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
              message: fsdMessage,
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
              message: fsdMessage,
            },
            {
              from: 'entities',
              allow: ['shared'],
              message: fsdMessage,
            },
            {
              from: 'shared',
              allow: ['shared'],
              message: fsdMessage,
            },
          ],
        },
      ],

      // TypeScript handles undefined names; unused imports are removed below
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'none',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // The icon registry is the single place allowed to import Lucide
  {
    files: ['src/shared/ui/icon/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: restrictedImports }],
    },
  },
];
