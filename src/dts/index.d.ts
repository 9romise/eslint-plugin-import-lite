import type { ESLint } from 'eslint'
import type { Configs } from './configs.d.ts'
import type { Rules } from './rules.d.ts'

export type { Configs } from './configs.d.ts'
export type { RuleOptions } from './rule-options.d.ts'
export type { Rules } from './rules.d.ts'

declare const plugin: {
  rules: Rules
  configs: ESLint.Plugin['configs'] & Configs
}

export default plugin
