import type { TSESTree as Tree } from '@typescript-eslint/types'

export {
  ReportFixFunction,
  RuleContext,
  RuleFix,
  RuleFixer,
  RuleListener,
  Scope,
  SourceCode,
} from '@typescript-eslint/utils/ts-eslint'

export {
  Tree,
}

export type Arrayable<T> = T | T[]

export type LiteralNodeValue = Tree.Literal['value']
