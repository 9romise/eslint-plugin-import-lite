import type { Linter } from 'eslint'
import babelParser from '@babel/eslint-parser'

// https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser
export const languageOptionsForBabel = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ['@babel/plugin-syntax-decorators', { version: 'legacy' }],
        ['@babel/plugin-syntax-export-default-from'],
        ['@babel/plugin-syntax-typescript'],
      ],
    },
  },
} satisfies Linter.LanguageOptions
