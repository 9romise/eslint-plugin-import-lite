import type { MessageIds, RuleOptions } from './type'
import { run, SYNTAX_VALID_CASES } from '~test/utils'
import rule from './no-named-default'

run<RuleOptions, MessageIds>({
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
        },
      ],
    },
    {
      code: 'import { foo, default as bar } from "./bar";',
      errors: [
        {
          messageId: 'default',
          data: { importName: 'bar' },
        },
      ],
    },

    {
      code: 'import { "default" as bar } from "./bar";',
      errors: [
        {
          messageId: 'default',
          data: { importName: 'bar' },
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
