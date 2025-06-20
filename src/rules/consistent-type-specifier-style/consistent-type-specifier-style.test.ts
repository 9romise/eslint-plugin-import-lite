import type { MessageIds, RuleOptions } from './type'
import { AST_NODE_TYPES } from '~/utils/ast'
import { $, run } from '~/utils/test'
import rule from './consistent-type-specifier-style'

run<RuleOptions, MessageIds>({
  name: 'consistent-type-specifier-style',
  rule,
  valid: [
    //
    // top-level
    //
    {
      code: 'import Foo from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import type Foo from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import { Foo } from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import { Foo as Bar } from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import * as Foo from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import {} from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import type {} from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import type { Foo } from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import type { Foo as Bar } from \'Foo\';',
      options: ['top-level'],
    },
    {
      code: 'import type { Foo, Bar, Baz, Bam } from \'Foo\';',
      options: ['top-level'],
    },

    // prefer-top-level
    {
      code: `import type { Foo } from 'Foo'`,
      options: ['prefer-top-level'],
    },
    {
      code: `import { Foo, type Bar } from 'Foo'`,
      options: ['prefer-top-level'],
    },

    //
    // inline
    //
    {
      code: 'import Foo from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import type Foo from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import { Foo } from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import { Foo as Bar } from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import * as Foo from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import {} from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import type {} from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import { type Foo } from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import { type Foo as Bar } from \'Foo\';',
      options: ['inline'],
    },
    {
      code: 'import { type Foo, type Bar, Baz, Bam } from \'Foo\';',
      options: ['inline'],
    },

    //
    // always valid
    //
    { code: 'import type * as Foo from \'Foo\';' },
  ],
  invalid: [

    //
    // top-level
    //
    {
      code: 'import { type Foo } from \'Foo\';',
      output: 'import type {Foo} from \'Foo\';',
      options: ['top-level'],
      errors: [
        {
          messageId: 'topLevel',
          data: {
            kind: 'type',
          },
          type: AST_NODE_TYPES.ImportDeclaration,
        },
      ],
    },
    {
      code: 'import { type Foo as Bar } from \'Foo\';',
      output: 'import type {Foo as Bar} from \'Foo\';',
      options: ['top-level'],
      errors: [
        { messageId: 'topLevel', type: AST_NODE_TYPES.ImportDeclaration },
      ],
    },
    {
      code: 'import { type Foo, type Bar } from \'Foo\';',
      output: 'import type {Foo, Bar} from \'Foo\';',
      options: ['top-level'],
      errors: [
        { messageId: 'topLevel', type: AST_NODE_TYPES.ImportDeclaration },
      ],
    },
    {
      code: 'import { Foo, type Bar } from \'Foo\';',
      output: 'import { Foo  } from \'Foo\';\nimport type {Bar} from \'Foo\';',
      options: ['top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportSpecifier }],
    },
    {
      code: 'import { type Foo, Bar } from \'Foo\';',
      output: 'import {  Bar } from \'Foo\';\nimport type {Foo} from \'Foo\';',
      options: ['top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportSpecifier }],
    },
    {
      code: 'import Foo, { type Bar } from \'Foo\';',
      output: 'import Foo from \'Foo\';\nimport type {Bar} from \'Foo\';',
      options: ['top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportSpecifier }],
    },
    {
      code: 'import Foo, { type Bar, Baz } from \'Foo\';',
      output: 'import Foo, {  Baz } from \'Foo\';\nimport type {Bar} from \'Foo\';',
      options: ['top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportSpecifier }],
    },
    // https://github.com/import-js/eslint-plugin-import-x/issues/2753
    {
      code: $`
        \
        import { Component, type ComponentProps } from "package-1";
        import {
          Component1,
          Component2,
          Component3,
          Component4,
          Component5,
        } from "package-2";
      `,
      output: $`
        \
        import { Component  } from "package-1";
        import type {ComponentProps} from "package-1";
        import {
          Component1,
          Component2,
          Component3,
          Component4,
          Component5,
        } from "package-2";
      `,
      options: ['top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportSpecifier }],
    },

    // prefer-top-level
    {
      code: `import { type Foo, type Bar } from 'Foo';`,
      output: `import type {Foo, Bar} from 'Foo';`,
      options: ['prefer-top-level'],
      errors: [{ messageId: 'topLevel', type: AST_NODE_TYPES.ImportDeclaration }],
    },

    //
    // inline
    //
    {
      code: 'import type { Foo } from \'Foo\';',
      output: 'import  { type Foo } from \'Foo\';',
      options: ['inline'],
      errors: [
        {
          messageId: 'inline',
          data: {
            kind: 'type',
          },
          type: AST_NODE_TYPES.ImportDeclaration,
        },
      ],
    },
    {
      code: 'import type { Foo, Bar, Baz } from \'Foo\';',
      output: 'import  { type Foo, type Bar, type Baz } from \'Foo\';',
      options: ['inline'],
      errors: [{ messageId: 'inline', type: AST_NODE_TYPES.ImportDeclaration }],
    },
  ],
})
