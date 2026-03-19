import { defineConfig } from '@vida0905/eslint-config'

export default defineConfig({
  pnpm: true,
}, {
  files: ['src/rules/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
}, {
  files: [
    '**/*.test.ts',
  ],
  name: 'local/test',
  rules: {
    'antfu/indent-unindent': 'error',
  },
}, {
  name: 'local/restrict',
  files: ['src/**/*.ts'],
  rules: {
    'ts/no-restricted-imports': ['error', {
      paths: [
        {
          name: '@typescript-eslint/utils',
          allowTypeImports: true,
        },
        {
          name: '@typescript-eslint/utils/ast-utils',
          allowTypeImports: true,
        },
        {
          name: '@typescript-eslint/utils/eslint-utils',
          allowTypeImports: true,
        },
      ],
    }],
  },
}, {
  name: 'rules/restrict',
  files: ['src/**/*.ts'],
  ignores: ['src/?(utils|types)/**/*.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: '@typescript-eslint/utils',
          importNames: ['TSESLint', 'TSESTree'],
          message: 'Import from "~/types" instead',
        },
        {
          name: '@typescript-eslint/utils/ts-eslint',
          message: 'Import from "~/types" instead',
        },
      ],
    }],
  },
})
