import { basename, dirname, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import { defineConfig } from 'tsdown'

const rulesEntry = globSync(`src/rules/**/*.ts`, {
  ignore: ['**/*.test.ts', 'src/rules/index.ts'],
})

export default defineConfig({
  clean: true,
  dts: true,
  alias: {
    '~': resolve('src'),
  },
  entry: {
    index: 'src/index.ts',
    ...Object.fromEntries(rulesEntry.map((file) => [`rules/${basename(dirname(file))}`, file])),
  },
  outputOptions: {
    chunkFileNames(info) {
      if (info.moduleIds.length === 1 && info.moduleIds[0].includes('rules')) {
        return 'rules/[name].js'
      }
      return '[name].js'
    },
  },
  shims: true,
  format: 'esm',
})
