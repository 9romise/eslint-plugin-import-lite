import type { RuleContext } from '~/types'

export function sourceType<MessageIds extends string, Options extends readonly unknown[]>(context: RuleContext<MessageIds, Options>) {
  if ('parserOptions' in context && 'sourceType' in context.parserOptions) {
    return context.parserOptions.sourceType
  }
  if ('languageOptions' in context && context.languageOptions) {
    return context.languageOptions.sourceType
  }
}
