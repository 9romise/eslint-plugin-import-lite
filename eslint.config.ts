import { defineConfig } from '@vida0905/eslint-config'
import importLite from 'eslint-plugin-import-lite'

export default defineConfig({
  pnpm: true,
}, {
  files: ['src/rules/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
}).append({
  ...importLite.configs.recommended,
})
