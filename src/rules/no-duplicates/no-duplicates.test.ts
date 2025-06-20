import type { MessageIds, RuleOptions } from './type'
import type { TestCaseError } from '~/utils/test'
import { $, run } from '~/utils/test'
import rule from './no-duplicates'

function createDuplicatedError(
  module: string,
): TestCaseError<MessageIds> {
  return {
    messageId: 'duplicate',
    data: { module },
  }
}

run<RuleOptions, MessageIds>({
  name: 'no-duplicates',
  rule,
  valid: [
    {
      code: 'import "./malformed.js"',
    },

    { code: 'import { x } from \'./foo\'; import { y } from \'./bar\'' },

    // #86: every unresolved module should not show up as 'null' and duplicate
    {
      code: 'import foo from "234artaf"; import { shoop } from "234q25ad"',
    },

    // #1538: It is impossible to import namespace and other in one line, so allow this.
    {
      code: 'import * as ns from \'./foo\'; import {y} from \'./foo\'',
    },
    {
      code: 'import {y} from \'./foo\'; import * as ns from \'./foo\'',
    },
  ],
  invalid: [
    {
      code: 'import { x } from \'./foo\'; import { y } from \'./foo\'',
      output: 'import { x, y  } from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import {y} from \'./foo\'; import { z } from \'./foo\'',
      output: 'import {x,y, z } from \'./foo\';  ',
      errors: [
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
      ],
    },

    // #86: duplicate unresolved modules should be flagged
    {
      // Autofix bail because of different default import names.
      code: 'import foo from \'non-existent\'; import bar from \'non-existent\';',
      errors: [
        createDuplicatedError('non-existent'),
        createDuplicatedError('non-existent'),
      ],
    },

    {
      code: 'import \'./foo\'; import \'./foo\'',
      output: 'import \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import { x, /* x */ } from \'./foo\'; import {//y\ny//y2\n} from \'./foo\'',
      output: 'import { x,//y\ny//y2\n /* x */ } from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import {} from \'./foo\'',
      output: 'import {x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    // #2347: duplicate identifiers should be removed
    {
      code: 'import {a} from \'./foo\'; import { a } from \'./foo\'',
      output: 'import {a} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    // #2347: duplicate identifiers should be removed
    {
      code: 'import {a,b} from \'./foo\'; import { b, c } from \'./foo\'; import {b,c,d} from \'./foo\'',
      output: 'import {a,b, c ,d} from \'./foo\';  ',
      errors: [
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
      ],
    },

    // #2347: duplicate identifiers should be removed, but not if they are adjacent to comments
    {
      code: $`
        import {a} from './foo'; import { a/*,b*/ } from './foo'
      `,
      output: 'import {a, a/*,b*/ } from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import {} from \'./foo\'; import {/*c*/} from \'./foo\'; import {y} from \'./foo\'',
      output: 'import {x/*c*/,y} from \'./foo\';   ',
      errors: [
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
      ],
    },

    {
      code: 'import { } from \'./foo\'; import {x} from \'./foo\'',
      output: 'import {x } from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import \'./foo\'; import {x} from \'./foo\'',
      output: 'import {x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import\'./foo\'; import {x} from \'./foo\'',
      output: 'import {x} from\'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import \'./foo\'; import { /*x*/} from \'./foo\'; import {//y\n} from \'./foo\'; import {z} from \'./foo\'',
      output: 'import { /*x*///y\nz} from \'./foo\';   ',
      errors: [
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
      ],
    },

    {
      code: 'import \'./foo\'; import def, {x} from \'./foo\'',
      output: 'import def, {x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import \'./foo\'; import def from \'./foo\'',
      output: 'import def from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import def from \'./foo\'; import {x} from \'./foo\'',
      output: 'import def, {x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import def from \'./foo\'',
      output: 'import def, {x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import{x} from \'./foo\'; import def from \'./foo\'',
      output: 'import def,{x} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import def, {y} from \'./foo\'',
      output: 'import def, {x,y} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because cannot merge namespace imports.
      code: 'import * as ns1 from \'./foo\'; import * as ns2 from \'./foo\'',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import * as ns from \'./foo\'; import {x} from \'./foo\'; import {y} from \'./foo\'',
      // Autofix could merge some imports, but not the namespace import.
      output: 'import * as ns from \'./foo\'; import {x,y} from \'./foo\'; ',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: 'import {x} from \'./foo\'; import * as ns from \'./foo\'; import {y} from \'./foo\'; import \'./foo\'',
      // Autofix could merge some imports, but not the namespace import.
      output: 'import {x,y} from \'./foo\'; import * as ns from \'./foo\';  ',
      errors: [
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
        createDuplicatedError('./foo'),
      ],
    },

    {
      // Autofix bail because of comment.
      code: `
        // some-tool-disable-next-line
        import {x} from './foo'
        import {//y\ny} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        // some-tool-disable-next-line
        import {y} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo' // some-tool-disable-line
        import {y} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import {y} from './foo' // some-tool-disable-line
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        /* comment */ import {y} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import {y} from './foo' /* comment
        multiline */
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: `
import {x} from './foo'
import {y} from './foo'
// some-tool-disable-next-line
      `,
      // Not autofix bail.
      output: `
import {x,y} from './foo'
// some-tool-disable-next-line
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: `
import {x} from './foo'
// comment

import {y} from './foo'
      `,
      // Not autofix bail.
      output: `
import {x,y} from './foo'
// comment

      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import/* comment */{y} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import/* comment */'./foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import{y}/* comment */from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from './foo'
        import{y}from/* comment */'./foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      // Autofix bail because of comment.
      code: `
        import {x} from
        // some-tool-disable-next-line
        './foo'
        import {y} from './foo'
      `,
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    // #2027 long import list generate empty lines
    {
      code: 'import { Foo } from \'./foo\';\nimport { Bar } from \'./foo\';\nexport const value = {}',
      output: 'import { Foo, Bar  } from \'./foo\';\nexport const value = {}',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    // #2027 long import list generate empty lines
    {
      code: 'import { Foo } from \'./foo\';\nimport Bar from \'./foo\';\nexport const value = {}',
      output: 'import Bar, { Foo } from \'./foo\';\nexport const value = {}',
      errors: [createDuplicatedError('./foo'), createDuplicatedError('./foo')],
    },

    {
      code: $`
        import {
          DEFAULT_FILTER_KEYS,
          BULK_DISABLED,
        } from '../constants';
        import React from 'react';
        import {
          BULK_ACTIONS_ENABLED
        } from '../constants';
        
        const TestComponent = () => {
          return <div>
          </div>;
        }
        
        export default TestComponent;
      `,
      output: $`
        import {
          DEFAULT_FILTER_KEYS,
          BULK_DISABLED,
          BULK_ACTIONS_ENABLED
        
        } from '../constants';
        import React from 'react';
        
        const TestComponent = () => {
          return <div>
          </div>;
        }
        
        export default TestComponent;
      `,
      errors: [
        createDuplicatedError('../constants'),
        createDuplicatedError('../constants'),
      ],
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    {
      code: `
        import {A1,} from 'foo';
        import {B1,} from 'foo';
        import {C1,} from 'foo';

        import {
          A2,
        } from 'bar';
        import {
          B2,
        } from 'bar';
        import {
          C2,
        } from 'bar';

      `,
      output: `
        import {A1,B1,C1} from 'foo';
                ${''}
        import {
          A2,
          B2,
          C2
        } from 'bar';
                ${''}
      `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 2,
          column: 27,
        },
        {
          ...createDuplicatedError('foo'),
          line: 3,
          column: 27,
        },
        {
          ...createDuplicatedError('foo'),
          line: 4,
          column: 27,
        },
        {
          ...createDuplicatedError('bar'),
          line: 8,
          column: 16,
        },
        {
          ...createDuplicatedError('bar'),
          line: 11,
          column: 16,
        },
        {
          ...createDuplicatedError('bar'),
          line: 14,
          column: 16,
        },
      ],
      parserOptions: { jsx: true },
    },
  ],
})

run({
  rule,
  valid: [
    // #1667: ignore duplicate if is a typescript type import
    {
      code: 'import type { x } from \'./foo\'; import y from \'./foo\'',
    },
    {
      code: 'import type { x } from \'./foo\'; import type * as y from \'./foo\'',
    },
    {
      code: 'import type x from \'./foo\'; import type y from \'./bar\'',
    },
    {
      code: 'import type {x} from \'./foo\'; import type {y} from \'./bar\'',
    },
    {
      code: 'import type x from \'./foo\'; import type {y} from \'./foo\'',
    },
    {
      code: `
        import type {} from './module';
        import {} from './module2';
      `,
    },
    {
      code: `
        import type { Identifier } from 'module';

        declare module 'module2' {
          import type { Identifier } from 'module';
        }

        declare module 'module3' {
          import type { Identifier } from 'module';
        }
      `,
    },
    {
      code: 'import type { A } from \'foo\';import type B from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
    {
      code: 'import { type A } from \'foo\';import type B from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
    {
      code: 'import type A from \'foo\';import { B } from \'foo\';',
      options: [{ 'prefer-inline': true }],
    },
  ],

  invalid: [
    {
      code: 'import type x from \'./foo\'; import type y from \'./foo\'',
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 20,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 48,
        },
      ],
    },
    {
      code: 'import type x from \'./foo\'; import type x from \'./foo\'',
      output: 'import type x from \'./foo\'; ',
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 20,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 48,
        },
      ],
    },
    {
      code: 'import type {x} from \'./foo\'; import type {y} from \'./foo\'',
      output: `import type {x,y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import type {y} from \'./foo\'',
      options: [{ 'prefer-inline': false }],
      output: `import {type x,y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import type {x} from \'foo\'; import {type y} from \'foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'foo\'; import type {y} from \'foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'foo\'; import type {y} from \'foo\'',
      output: `import {type x,y} from 'foo'; `,
      errors: [
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('foo'),
          line: 1,
          column: 50,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import {type y} from \'./foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {type x,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {type x} from \'./foo\'; import {type y} from \'./foo\'',
      output: `import {type x,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: 'import {AValue, type x, BValue} from \'./foo\'; import {type y} from \'./foo\'',
      output: `import {AValue, type x, BValue,type y} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 38,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 68,
        },
      ],
    },
    // #2834 Detect duplicates across type and regular imports
    {
      code: 'import {AValue} from \'./foo\'; import type {AType} from \'./foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import {AValue,type AType} from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 22,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 56,
        },
      ],
    },
    {
      code: 'import type { AType as BType } from \'./foo\'; import { CValue } from \'./foo\'',
      options: [{ 'prefer-inline': true }],
      output: `import { type AType as BType, CValue  } from './foo'; `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 37,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 1,
          column: 69,
        },
      ],
    },
    {
      code: `
            import {
              a
            } from './foo';
            import type {
              b,
              c,
            } from './foo';`,
      options: [{ 'prefer-inline': true }],
      output: `
            import {
              a,
              type b,
              type c
            } from './foo';
            `,
      errors: [
        {
          ...createDuplicatedError('./foo'),
          line: 4,
          column: 20,
        },
        {
          ...createDuplicatedError('./foo'),
          line: 8,
          column: 20,
        },
      ],
    },
  ],
})
