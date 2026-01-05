import type { MessageIds, RuleOptions } from './type'
import type { Tree } from '~/types'
import { createRule } from '~/utils'
import { getValue } from '~/utils/ast'

export default createRule<RuleOptions, MessageIds>({
  name: 'prefer-default-export',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer a default export if module exports a single name or multiple names.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          target: {
            type: 'string',
            enum: ['single', 'any'],
            default: 'single',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      single: 'Prefer default export on a file with single export.',
      any: 'Prefer default export to be present on every file that has export.',
    },
  },
  defaultOptions: [{ target: 'single' }],
  create(context, [options]) {
    let specifierExportCount = 0
    let hasDefaultExport = false
    let hasStarExport = false
    let hasTypeExport = false

    let namedExportNode: Tree.Node

    // get options. by default we look into files with single export
    const { target } = options || {}

    function captureDeclaration(identifierOrPattern?: Tree.Node | null) {
      if (identifierOrPattern?.type === 'ObjectPattern') {
        // recursively capture
        for (const property of identifierOrPattern.properties) {
          captureDeclaration(property.value)
        }
      } else if (identifierOrPattern?.type === 'ArrayPattern') {
        for (const el of identifierOrPattern.elements) {
          captureDeclaration(el)
        }
      } else {
        // assume it's a single standard identifier
        specifierExportCount++
      }
    }

    return {
      ExportDefaultSpecifier() {
        hasDefaultExport = true
      },

      ExportSpecifier(node) {
        if (getValue(node.exported) === 'default') {
          hasDefaultExport = true
        } else {
          specifierExportCount++
          namedExportNode = node
        }
      },

      ExportNamedDeclaration(node) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) {
          return
        }

        const { type } = node.declaration

        if (
          type === 'TSTypeAliasDeclaration'
          || type === 'TSInterfaceDeclaration'
        ) {
          specifierExportCount++
          hasTypeExport = true
          return
        }

        if (
          'declarations' in node.declaration
          && node.declaration.declarations
        ) {
          for (const declaration of node.declaration.declarations) {
            captureDeclaration(declaration.id)
          }
        } else {
          // captures 'export function foo() {}' syntax
          specifierExportCount++
        }

        namedExportNode = node
      },

      ExportDefaultDeclaration() {
        hasDefaultExport = true
      },

      ExportAllDeclaration() {
        hasStarExport = true
      },

      'Program:exit': function () {
        if (hasDefaultExport || hasStarExport || hasTypeExport) {
          return
        }
        if (target === 'single' && specifierExportCount === 1) {
          context.report({
            node: namedExportNode,
            messageId: 'single',
          })
        } else if (target === 'any' && specifierExportCount > 0) {
          context.report({
            node: namedExportNode,
            messageId: 'any',
          })
        }
      },
    }
  },
})
