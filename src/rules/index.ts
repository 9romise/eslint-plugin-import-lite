/* GENERATED, DO NOT EDIT DIRECTLY */

import type { Rules } from '~/dts/rules'

import consistentTypeSpecifierStyle from './consistent-type-specifier-style/consistent-type-specifier-style'
import exportsLast from './exports-last/exports-last'
import first from './first/first'
import newlineAfterImport from './newline-after-import/newline-after-import'
import noDefaultExport from './no-default-export/no-default-export'
import noDuplicates from './no-duplicates/no-duplicates'
import noMutableExports from './no-mutable-exports/no-mutable-exports'
import noNamedDefault from './no-named-default/no-named-default'

export const rules = {
  'consistent-type-specifier-style': consistentTypeSpecifierStyle,
  'exports-last': exportsLast,
  'first': first,
  'newline-after-import': newlineAfterImport,
  'no-default-export': noDefaultExport,
  'no-duplicates': noDuplicates,
  'no-mutable-exports': noMutableExports,
  'no-named-default': noNamedDefault,
} satisfies Rules
