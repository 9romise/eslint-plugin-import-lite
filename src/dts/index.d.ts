import type { ESLint } from 'eslint'
import type { Configs } from './configs.js'
import type { Rules } from './rules.js'

export type { Configs } from './configs.js'
export type { RuleOptions } from './rule-options.js'
export type { Rules } from './rules.js'

declare const plugin: {
  rules: Rules
  configs: ESLint.Plugin['configs'] & Configs
}

export default plugin
