import type { ESLint, Linter } from 'eslint'
import { rules } from './rules'

const pluginName = 'import-lite'

const recommendedRules: Linter.RulesRecord = Object.fromEntries(
  Object.keys(rules).map((ruleName) => [`${pluginName}/${ruleName}`, 'error']),
)

export default {
  rules: rules satisfies ESLint.Plugin['rules'],
  configs: {
    'recommended': {
      plugins: {
        [pluginName]: {
          name: pluginName,
          rules,
        },
      },
      rules: recommendedRules,
    } satisfies Linter.Config,
    'recommended-legacy': {
      plugins: [pluginName],
      rules: recommendedRules,
    } satisfies Linter.LegacyConfig,
  },
}
