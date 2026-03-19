import type { RuleContext } from '~/types'

export function sourceType<MessageIds extends string, Options extends readonly unknown[]>(context: RuleContext<MessageIds, Options>) {
  if (context.parserOptions && 'sourceType' in context.parserOptions) {
    return context.parserOptions.sourceType
  }
  if (context.languageOptions) {
    return context.languageOptions.sourceType
  }
}
