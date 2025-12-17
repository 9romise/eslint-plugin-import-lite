import type { MessageIds, RuleOptions } from './type'
import { run } from '~test/utils'
import rule from './exports-last'

run<RuleOptions, MessageIds>({
  name: 'exports-last',
  rule,
  valid: [
    // Empty file
    {
      code: '// comment',
    },
    {
      // No exports
      code: `
        const foo = 'bar'
        const bar = 'baz'
      `,
    },
    {
      code: `
        const foo = 'bar'
        export {foo}
      `,
    },
    {
      code: `
        const foo = 'bar'
        export default foo
      `,
    },
    // Only exports
    {
      code: `
        export default foo
        export const bar = true
      `,
    },
    {
      code: `
        const foo = 'bar'
        export default foo
        export const bar = true
      `,
    },
    // Multiline export
    {
      code: `
        const foo = 'bar'
        export default function bar () {
          const very = 'multiline'
        }
        export const baz = true
      `,
    },
    // Many exports
    {
      code: `
        const foo = 'bar'
        export default foo
        export const so = 'many'
        export const exports = ':)'
        export const i = 'cant'
        export const even = 'count'
        export const how = 'many'
      `,
    },
    // Export all
    {
      code: `
        export * from './foo'
      `,
    },
  ],
  invalid: [
    // Default export before variable declaration
    {
      code: `
        export default 'bar'
        const bar = true
      `,
      errors: [
        { messageId: 'end', type: 'ExportDefaultDeclaration' },
      ],
    },
    // Named export before variable declaration
    {
      code: `
        export const foo = 'bar'
        const bar = true
      `,
      errors: [
        { messageId: 'end', type: 'ExportNamedDeclaration' },
      ],
    },
    // Export all before variable declaration
    {
      code: `
        export * from './foo'
        const bar = true
      `,
      errors: [
        { messageId: 'end', type: 'ExportAllDeclaration' },
      ],
    },
    // Many exports around variable declaration
    {
      code: `
        export default 'such foo many bar'
        export const so = 'many'
        const foo = 'bar'
        export const exports = ':)'
        export const i = 'cant'
        export const even = 'count'
        export const how = 'many'
      `,
      errors: [
        { messageId: 'end', type: 'ExportDefaultDeclaration' },
        { messageId: 'end', type: 'ExportNamedDeclaration' },
      ],
    },
  ],
})
