import type { RuleTesterInitOptions, TestCasesOptions, ValidTestCase } from 'eslint-vitest-rule-tester'
import tsParser from '@typescript-eslint/parser'
import { run as _run } from 'eslint-vitest-rule-tester'

export * from 'eslint-vitest-rule-tester'

export { unindent as $ } from 'eslint-vitest-rule-tester'

export interface ExtendedRuleTesterOptions<RuleOptions = any, MessageIds extends string = string> extends RuleTesterInitOptions, TestCasesOptions<RuleOptions, MessageIds> {
  lang?: 'js' | 'ts'
}

export function run<RuleOptions, MessageIds extends string>(options: ExtendedRuleTesterOptions<RuleOptions, MessageIds>): Promise<void> {
  return _run<RuleOptions, MessageIds>({
    recursive: false,
    verifyAfterFix: false,
    ...(options.lang === 'js' ? {} : { parser: tsParser }),
    ...options,
  })
}

/**
 * To be added as valid cases just to ensure no nullable fields are going to
 * crash at runtime
 */
export const SYNTAX_VALID_CASES: ValidTestCase[]
  = [
    'for (let { foo, bar } of baz) {}',
    'for (let [ foo, bar ] of baz) {}',

    'const { x, y } = bar',

    // all the exports
    'let x; export { x }',
    'let x; export { x as y }',

    // not sure about these since they reference a file
    // 'export { x } from "./y.js"'}),
    // 'export * as y from "./y.js"', languageOptions: { parser: require(parsers.BABEL) } }),

    'export const x = null',
    'export var x = null',
    'export let x = null',

    'export default x',
    'export default class x {}',

    // issue #267: parser opt-in extension list
    {
      code: 'import json from "./data.json"',
      // settings: { 'import-x/extensions': ['.js'] }, // breaking: remove for v2
    },

    // JSON
    {
      code: 'import foo from "./foobar.json";',
      // settings: { 'import-x/extensions': ['.js'] }, // breaking: remove for v2
    },
    {
      code: 'import foo from "./foobar";',
      // settings: { 'import-x/extensions': ['.js'] }, // breaking: remove for v2
    },

    // issue #370: deep commonjs import
    {
      code: 'import { foo } from "./issue-370-commonjs-namespace/bar"',
      // settings: { 'import-x/ignore': ['foo'] },
    },

    // issue #348: deep commonjs re-export
    {
      code: 'export * from "./issue-370-commonjs-namespace/bar"',
      // settings: { 'import-x/ignore': ['foo'] },
    },

    {
      code: 'import * as a from "./commonjs-namespace/a"; a.b',
    },

    // ignore invalid extensions
    {
      code: 'import { foo } from "./ignore.invalid.extension"',
    },
  ]
