import type { MessageIds, RuleOptions } from './type'
import { run } from '~test/utils'
import rule from './prefer-default-export'

// test cases for default option { target: 'single' }
run<RuleOptions, MessageIds>({
  name: 'prefer-default-export',
  rule,
  lang: 'js',
  valid: [
    {
      code: `
        export const foo = 'foo';
        export const bar = 'bar';`,
    },
    {
      code: `
        export default function bar() {};`,
    },
    {
      code: `
        export const foo = 'foo';
        export function bar() {};`,
    },
    {
      code: `
        export const foo = 'foo';
        export default bar;`,
    },
    {
      code: `
        let foo, bar;
        export { foo, bar }`,
    },
    {
      code: 'export const { foo, bar } = item;',
    },
    {
      code: 'export const { foo, bar: baz } = item;',
    },
    {
      code: 'export const { foo: { bar, baz } } = item;',
    },
    {
      code: 'export const [a, b] = item;',
    },
    {
      code: `
        let item;
        export const foo = item;
        export { item };`,
    },
    {
      code: `
        let foo;
        export { foo as default }`,
    },
    {
      code: `
        export * from './foo';`,
    },

    // no exports at all
    {
      code: `import * as foo from './foo';`,
    },

    {
      code: 'export { a, b } from "foo.js"',
    },
    // ...SYNTAX_CASES,
    {
      code: `
        export const [CounterProvider,, withCounter] = func();;
      `,
    },
    {
      code: 'let foo; export { foo as "default" };',
      languageOptions: {
        parserOptions: { ecmaVersion: 2022 },
      },
    },
  ],
  invalid: [
    {
      code: 'export function bar() {};',
      errors: [{ messageId: 'single' }],
    },
    {
      code: `export const foo = 'foo';`,
      errors: [{ messageId: 'single' }],
    },
    {
      code: `
        const foo = 'foo';
        export { foo };`,
      errors: [{ messageId: 'single' }],
    },
    {
      code: 'export const { foo } = { foo: "bar" };',
      errors: [{ messageId: 'single' }],
    },
    {
      code: 'export const { foo: { bar } } = { foo: { bar: "baz" } };',
      errors: [{ messageId: 'single' }],
    },
    {
      code: 'export const [a] = ["foo"]',
      errors: [{ messageId: 'single' }],
    },
  ],
})

// test cases for { target: 'any' }
run({
  name: 'prefer-default-export',
  rule,
  // Any exporting file must contain default export
  valid: [
    {
      code: 'export default function bar() {};',
      options: [{ target: 'any' }],
    },
    {
      code: `
              export const foo = 'foo';
              export const bar = 'bar';
              export default 42;`,
      options: [{ target: 'any' }],
    },
    {
      code: 'export default a = 2;',
      options: [{ target: 'any' }],
    },
    {
      code: `
            export const a = 2;
            export default function foo() {};`,
      options: [{ target: 'any' }],
    },
    {
      code: `
          export const a = 5;
          export function bar(){};
          let foo;
          export { foo as default }`,
      options: [{ target: 'any' }],
    },
    {
      code: `export * from './foo';`,
      options: [{ target: 'any' }],
    },
    // no exports at all
    {
      code: `import * as foo from './foo';`,
      options: [{ target: 'any' }],
    },
    {
      code: 'const a = 5;',
      options: [{ target: 'any' }],
    },
    {
      code: 'export const a = 4; let foo; export { foo as "default" };',
      options: [{ target: 'any' }],
      languageOptions: {
        parserOptions: { ecmaVersion: 2022 },
      },
    },
  ],
  // { target: 'any' } invalid cases when any exporting file must contain default export but does not
  invalid: [
    {
      code: `
        export const foo = 'foo';
        export const bar = 'bar';`,
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: `
        export const foo = 'foo';
        export function bar() {};`,
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: `
        let foo, bar;
        export { foo, bar }`,
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: `
        let item;
        export const foo = item;
        export { item };`,
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: 'export { a, b } from "foo.js"',
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: `
        const foo = 'foo';
        export { foo };`,
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: 'export const { foo } = { foo: "bar" };',
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
    {
      code: 'export const { foo: { bar } } = { foo: { bar: "baz" } };',
      options: [{ target: 'any' }],
      errors: [{ messageId: 'any' }],
    },
  ],
})

run({
  name: 'prefer-default-export',
  rule,
  lang: 'ts',
  valid: [
    // Exporting types
    {
      code: `
        export type foo = string;
        export type bar = number;
      `,
    },
    {
      code: 'export type foo = string',
    },
    {
      code: 'export interface foo { bar: string; }',
    },
    {
      code: 'export interface foo { bar: string; }; export function goo() {}',
    },
  ],
  invalid: [],
})
