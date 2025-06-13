import type { ESLintRuleModule } from '~/utils'
import first from './first/first'

export const rules: Record<string, ESLintRuleModule<unknown[], string>> = {
  first,
}
