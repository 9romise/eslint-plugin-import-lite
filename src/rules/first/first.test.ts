import type { MessageIds, RuleOptions } from './type'
import { $, run } from '~test/utils'
import rule from './first'

run<RuleOptions, MessageIds>({
  name: 'first',
  rule,
  valid: [
    $`
      import { x } from './foo'; import { y } from './bar';
      export { x, y }
    `,
    `import { x } from 'foo'; import { y } from './bar'`,
    `import { x } from './foo'; import { y } from 'bar'`,
    {
      code: `import { x } from './foo'; import { y } from 'bar'`,
      options: ['disable-absolute-first'],
    },
    $`
      'use directive';
      import { x } from 'foo';
    `,
    // {
    //   name: '...component.html (issue #2210)',
    //   code: fs.readFileSync(testFilePath('component.html'), 'utf8'),
    //   languageOptions: {
    //     parser: cjsRequire('@angular-eslint/template-parser'),
    //   },
    // },
  ],
  invalid: [
    {
      code: $`
        import { x } from './foo';
        export { x };
        import { y } from './bar';
      `,
      errors: [{ messageId: 'order' }],
      output: $`
        import { x } from './foo';
        import { y } from './bar';
        export { x };
      `,
    },
    {
      code: $`
        import { x } from './foo';
        export { x };
        import { y } from './bar';
        import { z } from './baz';
      `,
      errors: [{ messageId: 'order' }, { messageId: 'order' }],
      output: $`
        import { x } from './foo';
        import { y } from './bar';
        import { z } from './baz';
        export { x };
      `,
    },
    {
      code: `import { x } from './foo'; import { y } from 'bar'`,
      options: ['absolute-first'],
      errors: [{ messageId: 'absolute' }],
    },
    {
      code: $`
        import { x } from 'foo';
        'use directive';
        import { y } from 'bar';
      `,
      output: $`
        import { x } from 'foo';
        import { y } from 'bar';
        'use directive';
      `,
      errors: [{ messageId: 'order' }],
    },
    {
      code: $`
        var a = 1;
        import { y } from './bar';
        if (true) { x() };
        import { x } from './foo';
        import { z } from './baz';
      `,
      output: $`
        import { y } from './bar';
        var a = 1;
        if (true) { x() };
        import { x } from './foo';
        import { z } from './baz';
      `,
      // output: [
      //   $`import { y } from './bar';\
      //         var a = 1;\
      //         if (true) { x() };\
      //         import { x } from './foo';\
      //         import { z } from './baz';`,
      //   $`import { y } from './bar';\
      //         import { x } from './foo';\
      //         var a = 1;\
      //         if (true) { x() };\
      //         import { z } from './baz';`,
      //   $`import { y } from './bar';\
      //         import { x } from './foo';\
      //         import { z } from './baz';\
      //         var a = 1;\
      //         if (true) { x() };`,
      // ],
      errors: [
        { messageId: 'order' },
        { messageId: 'order' },
        { messageId: 'order' },
      ],
    },
    {
      code: `if (true) { console.log(1) }import a from 'b'`,
      output: $`
        import a from 'b'
        if (true) { console.log(1) }
      `,
      errors: [{ messageId: 'order' }],
    },
  ],
})

run({
  name: 'order',
  rule,
  valid: [
    `
          import y = require('bar');
          import { x } from 'foo';
          import z = require('baz');
        `,
  ],
  invalid: [
    {
      code: `
          import { x } from './foo';
          import y = require('bar');
        `,
      options: ['absolute-first'],
      errors: [{ messageId: 'absolute' }],
    },
  ],
})
