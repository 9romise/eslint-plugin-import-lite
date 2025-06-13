import type { RuleListener, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { Rule } from 'eslint'
import { deepMerge, isObjectNotArray } from '@typescript-eslint/utils/eslint-utils'

export interface ESLintRuleModule<
  T extends readonly unknown[],
  // eslint-disable-next-line unused-imports/no-unused-vars
  TMessageIds extends string,
> extends Rule.RuleModule {
  defaultOptions: T
}

interface TDocs {
  recommended: boolean
}

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(
  {
    name,
    create,
    defaultOptions = [] as any,
    meta,
  }: Omit<
    Readonly<RuleWithMetaAndName<TOptions, TMessageIds, TDocs>>,
    'defaultOptions'
  > & {
    defaultOptions?: TOptions
  },
): ESLintRuleModule<TOptions, TMessageIds> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>,
    ): RuleListener => {
      const optionsCount = Math.max(context.options.length, defaultOptions.length)
      const optionsWithDefault = Array.from(
        { length: optionsCount },
        (_, i) => {
          if (isObjectNotArray(context.options[i]) && isObjectNotArray(defaultOptions[i])) {
            return deepMerge(defaultOptions[i], context.options[i])
          }
          return context.options[i] ?? defaultOptions[i]
        },
      ) as unknown as TOptions
      return create(context, optionsWithDefault)
    }) as any,
    defaultOptions,
    meta: {
      ...meta,
      docs: {
        ...meta.docs,
        url: `https://github.com/9romise/eslint-plugin-import-lite/blob/main/src/rules/${name}/README.md`,
      },
    } as any,
  }
}
