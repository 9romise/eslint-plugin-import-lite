import type { ESLint, Linter } from 'eslint'
import type { ESLintRuleModule } from './utils'
import { rules } from './rules'

const pluginName = 'import-lite'

function generateConfig(name: string, filter?: (ruleName: string, rule: ESLintRuleModule<unknown[], string>) => boolean): Linter.Config {
  let ruleMeta = Object.entries(rules).filter(([_, rule]) => !rule.meta?.deprecated)

  if (filter)
    ruleMeta = ruleMeta.filter(([ruleName, rule]) => filter(ruleName, rule))

  return {
    name: `${pluginName}/${name}`,
    plugins: {
      [pluginName]: {
        name: pluginName,
        rules,
      },
    },
    rules: Object.fromEntries(
      ruleMeta.map(([ruleName]) => [`${pluginName}/${ruleName}`, 'error']),
    ),
  }
}

export default {
  rules: rules satisfies ESLint.Plugin['rules'],
  configs: {
    recommended: generateConfig(
      'recommended',
      (_, rule) => !!rule.meta?.docs?.recommended,
    ),
    all: generateConfig('all'),
  },
}
