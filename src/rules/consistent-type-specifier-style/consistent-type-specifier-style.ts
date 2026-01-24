import type { MessageIds, RuleOptions } from './type'
import type { RuleFix, SourceCode, Tree } from '~/types'
import { createRule } from '~/utils'
import { getValue, isCommaToken } from '~/utils/ast'

function getImportText(
  node: Tree.ImportDeclaration,
  sourceCode: Readonly<SourceCode>,
  specifiers: Tree.ImportSpecifier[],
) {
  const sourceString = sourceCode.getText(node.source)
  if (specifiers.length === 0) {
    return ''
  }

  const names = specifiers.map((s) => {
    const importedName = getValue(s.imported)
    if (importedName === s.local.name) {
      return importedName
    }
    return `${importedName} as ${s.local.name}`
  })
  // insert a fresh top-level import
  return `import type {${names.join(', ')}} from ${sourceString};`
}

export default createRule<RuleOptions, MessageIds>({
  name: 'consistent-type-specifier-style',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce or ban the use of inline type-only markers for named imports.',
    },
    fixable: 'code',
    schema: [
      {
        type: 'string',
        enum: ['top-level', 'inline', 'prefer-top-level'],
        default: 'top-level',
      },
    ],
    messages: {
      inline: 'Prefer using inline {{kind}} specifiers instead of a top-level {{kind}}-only import.',
      topLevel: 'Prefer using a top-level {{kind}}-only import instead of inline {{kind}} specifiers.',
    },
  },
  defaultOptions: ['top-level'],
  create(context, [options]) {
    const { sourceCode } = context

    if (options === 'inline') {
      return {
        ImportDeclaration(node) {
          if (node.importKind === 'value' || node.importKind == null) {
            // top-level value / unknown is valid
            return
          }

          if (
            // no specifiers (import type {} from '') have no specifiers to mark as inline
            node.specifiers.length === 0
            || (node.specifiers.length === 1
              // default imports are both "inline" and "top-level"
              && (node.specifiers[0].type === 'ImportDefaultSpecifier'
                // namespace imports are both "inline" and "top-level"
                || node.specifiers[0].type === 'ImportNamespaceSpecifier'))
          ) {
            return
          }

          context.report({
            node,
            messageId: 'inline',
            data: {
              kind: node.importKind,
            },
            fix(fixer) {
              const kindToken = sourceCode.getFirstToken(node, { skip: 1 })

              return [
                kindToken ? fixer.remove(kindToken) : [],
                node.specifiers.map((specifier) =>
                  fixer.insertTextBefore(specifier, `${node.importKind} `),
                ),
              ].flat()
            },
          })
        },
      }
    }

    // top-level
    return {
      ImportDeclaration(node) {
        if (
          // already top-level is valid
          node.importKind === 'type'
          // no specifiers (import {} from '') cannot have inline - so is valid
          || node.specifiers.length === 0
          || (node.specifiers.length === 1
            // default imports are both "inline" and "top-level"
            && (node.specifiers[0].type === 'ImportDefaultSpecifier'
              // namespace imports are both "inline" and "top-level"
              || node.specifiers[0].type === 'ImportNamespaceSpecifier'))
        ) {
          return
        }

        const typeSpecifiers: Tree.ImportSpecifier[] = []
        const valueSpecifiers: Tree.ImportSpecifier[] = []

        let defaultSpecifier: Tree.ImportDefaultSpecifier | null = null

        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier') {
            defaultSpecifier = specifier
            continue
          }

          if (!('importKind' in specifier)) {
            continue
          }

          if (specifier.importKind === 'type') {
            typeSpecifiers.push(specifier)
          } else if (
            specifier.importKind === 'value'
            || specifier.importKind == null
          ) {
            valueSpecifiers.push(specifier)
          }
        }

        const typeImport = getImportText(
          node,
          sourceCode,
          typeSpecifiers,
        )

        if (typeSpecifiers.length === node.specifiers.length) {
          context.report({
            node,
            messageId: 'topLevel',
            data: {
              kind: 'type',
            },
            fix(fixer) {
              return fixer.replaceText(node, typeImport)
            },
          })
        } else if (options === 'top-level') {
          // remove specific specifiers and insert new imports for them
          for (const specifier of typeSpecifiers) {
            context.report({
              node: specifier,
              messageId: 'topLevel',
              data: {
                kind: specifier.importKind,
              },
              fix(fixer) {
                const fixes: RuleFix[] = []

                // if there are no value specifiers, then the other report fixer will be called, not this one

                if (valueSpecifiers.length > 0) {
                  // import { Value, type Type } from 'mod';

                  // we can just remove the type specifiers
                  for (const specifier of typeSpecifiers) {
                    // remove the trailing comma
                    const token = sourceCode.getTokenAfter(specifier)
                    if (token && isCommaToken(token)) {
                      fixes.push(fixer.remove(token))
                    }
                    fixes.push(fixer.remove(specifier))
                  }

                  // make the import nicely formatted by also removing the trailing comma after the last value import
                  // eg
                  // import { Value, type Type } from 'mod';
                  // to
                  // import { Value  } from 'mod';
                  // not
                  // import { Value,  } from 'mod';
                  const maybeComma = sourceCode.getTokenAfter(
                    valueSpecifiers.at(-1),
                  )!
                  if (isCommaToken(maybeComma)) {
                    fixes.push(fixer.remove(maybeComma))
                  }
                } else if (defaultSpecifier) {
                  // import Default, { type Type } from 'mod';

                  // remove the entire curly block so we don't leave an empty one behind
                  // NOTE - the default specifier *must* be the first specifier always!
                  //        so a comma exists that we also have to clean up or else it's bad syntax
                  const comma = sourceCode.getTokenAfter(
                    defaultSpecifier,
                    isCommaToken,
                  )
                  const closingBrace = sourceCode.getTokenAfter(
                    node.specifiers.at(-1),
                    (token) => token.type === 'Punctuator' && token.value === '}',
                  )
                  fixes.push(
                    fixer.removeRange([
                      comma!.range[0],
                      closingBrace!.range[1],
                    ]),
                  )
                }

                return [
                  ...fixes,
                  // insert the new imports after the old declaration
                  fixer.insertTextAfter(node, `\n${typeImport}`),
                ]
              },
            })
          }
        }
      },
    }
  },
})
