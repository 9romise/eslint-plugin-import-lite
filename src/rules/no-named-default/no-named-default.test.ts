import type { MessageId, Options } from './no-named-default'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { run, SYNTAX_VALID_CASES } from '~/test-utils'
import rule from './no-named-default'

run<Options, MessageId>({
  name: 'no-named-default',
  rule,
  valid: [
    { code: 'import bar from "./bar";' },
    { code: 'import bar, { foo } from "./bar";' },

    ...SYNTAX_VALID_CASES,
  ],
  invalid: [
    {
      code: 'import { default as bar } from "./bar";',
      errors: [
        {
          messageId: 'default',
          data: { importName: 'bar' },
          type: AST_NODE_TYPES.Identifier,
        },
      ],
    },
    {
      code: 'import { foo, default as bar } from "./bar";',
      errors: [
        {
          messageId: 'default',
          data: { importName: 'bar' },
          type: AST_NODE_TYPES.Identifier,
        },
      ],
    },

    {
      code: 'import { "default" as bar } from "./bar";',
      errors: [
        {
          messageId: 'default',
          data: { importName: 'bar' },
          type: AST_NODE_TYPES.Identifier,
        },
      ],
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2022,
        },
      },
    },
  ],
})
