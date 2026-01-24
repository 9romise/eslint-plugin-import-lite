/* eslint perfectionist/sort-objects: "error" */

import { basename, dirname } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    copy: ['src/dts'],
    dts: false,
    exports: {
      customExports: (exports) => ({
        ...exports,
        './rule-options': './dist/dts/rule-options.d.ts',
      }),
    },
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
])
