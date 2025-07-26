import type { TestCaseError } from '~test/utils'
import type { MessageIds, RuleOptions } from './type'
import { run } from '~test/utils'
import rule from './no-mutable-exports'

function createNoMutableError(kind: string): TestCaseError<MessageIds> {
  return { messageId: 'noMutable', data: { kind } }
}

run<RuleOptions, MessageIds>({
  name: 'no-mutable-exports',
  rule,
  valid: [
    { code: 'export const count = 1' },
    { code: 'export function getCount() {}' },
    { code: 'export class Counter {}' },
    { code: 'export default count = 1' },
    { code: 'export default function getCount() {}' },
    { code: 'export default class Counter {}' },
    { code: 'const count = 1\nexport { count }' },
    { code: 'const count = 1\nexport { count as counter }' },
    { code: 'const count = 1\nexport default count' },
    { code: 'const count = 1\nexport { count as default }' },
    { code: 'function getCount() {}\nexport { getCount }' },
    { code: 'function getCount() {}\nexport { getCount as getCounter }' },
    { code: 'function getCount() {}\nexport default getCount' },
    { code: 'function getCount() {}\nexport { getCount as default }' },
    { code: 'class Counter {}\nexport { Counter }' },
    { code: 'class Counter {}\nexport { Counter as Count }' },
    { code: 'class Counter {}\nexport default Counter' },
    { code: 'class Counter {}\nexport { Counter as default }' },

    {
      code: 'const count = 1\nexport { count as "counter" }',
      languageOptions: {
        parserOptions: { ecmaVersion: 2022 },
      },
    },
  ],
  invalid: [
    {
      code: 'export let count = 1',
      errors: [createNoMutableError('let')],
    },
    {
      code: 'export var count = 1',
      errors: [createNoMutableError('var')],
    },
    {
      code: 'let count = 1\nexport { count }',
      errors: [createNoMutableError('let')],
    },
    {
      code: 'var count = 1\nexport { count }',
      errors: [createNoMutableError('var')],
    },
    {
      code: 'let count = 1\nexport { count as counter }',
      errors: [createNoMutableError('let')],
    },
    {
      code: 'var count = 1\nexport { count as counter }',
      errors: [createNoMutableError('var')],
    },
    {
      code: 'let count = 1\nexport default count',
      errors: [createNoMutableError('let')],
    },
    {
      code: 'var count = 1\nexport default count',
      errors: [createNoMutableError('var')],
    },
    {
      code: 'let count = 1\nexport { count as "counter" }',
      errors: [createNoMutableError('let')],
      languageOptions: {
        parserOptions: { ecmaVersion: 2022 },
      },
    },

    // todo: undeclared globals
    // {
    //   code: 'count = 1\nexport { count }',
    //   errors: [createNoMutableError('global binding')],
    // },
    // {
    //   code: 'count = 1\nexport default count',
    //   errors: [createNoMutableError('global binding')],
    // },
  ],
})
