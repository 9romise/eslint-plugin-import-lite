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
  files: ['src/**/*.ts'],
  ignores: ['**/*.test.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@typescript-eslint/utils'],
          importNames: [
            'AST_NODE_TYPES',
            'AST_TOKEN_TYPES',
          ],
          message: 'Import from "@typescript-eslint/types" instead',
        },
      ],
    }],
  },
}).append({
  ...importLite.configs.recommended,
})
