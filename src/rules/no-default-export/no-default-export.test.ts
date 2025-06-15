import type { MessageIds, RuleOptions } from './no-default-export'
import type { TestCaseError } from '~/test-utils'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { run } from '~/test-utils'
import rule from './no-default-export'

function createNoAliasDefaultError(
  local: string,
  type?: `${AST_NODE_TYPES}`,
): TestCaseError<MessageIds> {
  return {
    messageId: 'noAliasDefault',
    data: { local },
    type: type as AST_NODE_TYPES,
  }
}

run<RuleOptions, MessageIds>({
  name: 'no-default-export',
  rule,
  valid: [
    {
      code: 'module.exports = function foo() {}',
      languageOptions: {
        parserOptions: {
          sourceType: 'script',
        },
      },
    },
    {
      code: 'module.exports = function foo() {}',
    },
    {
      code: `
        export const foo = 'foo';
        export const bar = 'bar';
      `,
    },
    {
      code: `
        export const foo = 'foo';
        export function bar() {};
      `,
    },
    {
      code: `export const foo = 'foo';`,
    },
    {
      code: `
        const foo = 'foo';
        export { foo };
      `,
    },
    {
      code: `let foo, bar; export { foo, bar }`,
    },
    {
      code: `export const { foo, bar } = item;`,
    },
    {
      code: `export const { foo, bar: baz } = item;`,
    },
    {
      code: `export const { foo: { bar, baz } } = item;`,
    },
    {
      code: `
        let item;
        export const foo = item;
        export { item };
      `,
    },
    {
      code: `export * from './foo';`,
    },
    {
      code: `export const { foo } = { foo: "bar" };`,
    },
    {
      code: `export const { foo: { bar } } = { foo: { bar: "baz" } };`,
    },

    // no exports at all
    {
      code: `import * as foo from './foo';`,
    },
    {
      code: `import foo from './foo';`,
    },
    {
      code: `import {default as foo} from './foo';`,
    },
  ],
  invalid: [
    {
      code: 'export default function bar() {};',
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
          line: 1,
          column: 8,
        },
      ],
    },
    {
      code: `
        export const foo = 'foo';
        export default bar;`,
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
          line: 3,
          column: 16,
        },
      ],
    },
    {
      code: 'export default class Bar {};',
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
          line: 1,
          column: 8,
        },
      ],
    },
    {
      code: 'export default function() {};',
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
          line: 1,
          column: 8,
        },
      ],
    },
    {
      code: 'export default class {};',
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
          line: 1,
          column: 8,
        },
      ],
    },
    {
      code: 'let foo; export { foo as default }',
      errors: [createNoAliasDefaultError('foo', 'ExportNamedDeclaration')],
    },
    {
      code: 'function foo() { return \'foo\'; }\nexport default foo;',
      filename: 'foo.ts',
      errors: [
        {
          type: AST_NODE_TYPES.ExportDefaultDeclaration,
          messageId: 'preferNamed',
        },
      ],
    },
    {
      code: 'let foo; export { foo as "default" }',
      errors: [createNoAliasDefaultError('foo', 'ExportNamedDeclaration')],
    },
  ],
})
