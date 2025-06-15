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
}).append({
  ...importLite.configs.recommended,
})
