import type { TSESTree } from '@typescript-eslint/types'

export {
  ReportFixFunction,
  RuleContext,
  RuleFix,
  RuleFixer,
  Scope,
  SourceCode,
} from '@typescript-eslint/utils/ts-eslint'

export {
  TSESTree as Tree,
}

export type Arrayable<T> = T | T[]
