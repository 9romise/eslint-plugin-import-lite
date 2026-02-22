/* eslint perfectionist/sort-objects: "error" */

import { basename, dirname } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    dts: false,
    entry: ['src/index.ts'],
    hash: false,
    inlineOnly: [
      'es-toolkit',
    ],
    outputOptions: {
      codeSplitting: {
        groups: [
          {
            name: 'vender',
            test: 'node_modules',
          },
          {
            name: 'utils',
            test: 'utils',
          },
          {
            name: (id) => `rules/${basename(dirname(id))}`,
            test: (id) => id.includes('rules/') && !id.includes('rules/index.ts'),
          },
        ],
      },
    },
  },
  {
    attw: {
      profile: 'esm-only',
    },
    dts: {
      dtsInput: true,
    },
    entry: ['src/dts/index.d.ts', 'src/dts/rule-options.d.ts'],
    outDir: 'dist/dts',
  },
])
