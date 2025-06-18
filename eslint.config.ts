import { defineConfig } from '@vida0905/eslint-config'
import importLite from 'eslint-plugin-import-lite'

export default defineConfig({
  pnpm: true,
}, {
  files: ['src/rules/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
}, {
  files: [
    '**/*.test.{js,ts}',
  ],
  name: 'local/test',
  rules: {
    'antfu/indent-unindent': 'error',
  },
}, {
  name: 'local/restrict',
  files: ['src/**/*.ts'],
  ignores: ['src/?(utils|types)/**/*.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: '@typescript-eslint/utils',
          importNames: ['ASTUtils', 'AST_NODE_TYPES', 'AST_TOKEN_TYPES'],
          message: 'Import from "~/utils/ast" instead',
        },
        {
          name: '@typescript-eslint/types',
          message: 'Import from "~/utils/ast" instead',
        },
        {
          name: '@typescript-eslint/utils/ast-utils',
          message: 'Import from "~/utils/ast" instead',
        },
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
}).append({
  ...importLite.configs.recommended,
})
