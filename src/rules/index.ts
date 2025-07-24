/* GENERATED, DO NOT EDIT DIRECTLY */

import type { ESLintRuleModule } from '~/utils'

import consistentTypeSpecifierStyle from './consistent-type-specifier-style/consistent-type-specifier-style'
import first from './first/first'
import newlineAfterImport from './newline-after-import/newline-after-import'
import noDefaultExport from './no-default-export/no-default-export'
import noDuplicates from './no-duplicates/no-duplicates'
import noMutableExports from './no-mutable-exports/no-mutable-exports'
import noNamedDefault from './no-named-default/no-named-default'
import noRestrictedPaths from './no-restricted-paths/no-restricted-paths'

export const rules: Record<string, ESLintRuleModule<unknown[], string>> = {
  'consistent-type-specifier-style': consistentTypeSpecifierStyle,
  'first': first,
  'newline-after-import': newlineAfterImport,
  'no-default-export': noDefaultExport,
  'no-duplicates': noDuplicates,
  'no-mutable-exports': noMutableExports,
  'no-named-default': noNamedDefault,
  'no-restricted-paths': noRestrictedPaths,
}
