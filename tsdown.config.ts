/* eslint perfectionist/sort-objects: "error" */

import { basename, dirname } from 'node:path'
import { globSync } from 'tinyglobby'
import { defineConfig } from 'tsdown'

const rulesEntry = globSync('src/rules/**/*.ts', {
  ignore: ['**/*.test.ts', 'src/rules/index.ts'],
})

export default defineConfig([
  {
    copy: ['src/dts'],
    dts: false,
    entry: ['src/index.ts'],
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
