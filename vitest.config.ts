import type { ViteUserConfig } from 'vitest/config'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve('src'),
    },
  },
}) as ViteUserConfig
