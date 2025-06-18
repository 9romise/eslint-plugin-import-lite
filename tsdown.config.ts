/* eslint perfectionist/sort-objects: "error" */

import { basename, dirname, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import { defineConfig } from 'tsdown'

const rulesEntry = globSync(`src/rules/**/*.ts`, {
  ignore: ['**/*.test.ts', 'src/rules/index.ts'],
})

export default defineConfig([
  {
    dts: {
      emitDtsOnly: true,
    },
    entry: ['src/index.ts'],
  },
  {
    alias: {
      '~': resolve('src'),
    },
    clean: true,
    dts: false,
    entry: ['src/index.ts'],
    format: 'esm',
    hash: false,
    outputOptions: {
      advancedChunks: {
        groups: [
          {
            name: 'vender',
            test: 'node_modules',
          },
          {
            name: 'utils',
            test: 'utils',
          },
          ...rulesEntry.map((rule) => ({
            name: `rules/${basename(dirname(rule))}`,
            test: rule,
          })),
        ],
      },
    },
    shims: true,
  },
])
