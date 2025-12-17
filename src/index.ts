import type { ESLint, Linter } from 'eslint'
import type { Rules } from './dts'
import { rules } from './rules'

export const pluginName = 'import-lite'

function generateConfig<T extends keyof Rules>(
  name: string,
  filter: (ruleName: T, rule: Rules[T]) => boolean = () => true,
): Linter.Config {
  const ruleMeta
    = Object.entries(rules)
      .filter(([ruleName, rule]) => !rule.meta?.deprecated && filter(ruleName as T, rule))

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
  rules,
  configs: {
    recommended: generateConfig(
      'recommended',
      (_, rule) => !!rule.meta?.docs?.recommended,
    ),
    all: generateConfig('all'),
  },
} satisfies ESLint.Plugin
