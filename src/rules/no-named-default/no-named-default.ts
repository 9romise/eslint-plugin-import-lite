import type { MessageIds, RuleOptions } from './type'
import { createRule } from '~/utils'
import { getValue } from '~/utils/ast'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-named-default',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid named default exports.',
    },
    schema: [],
    messages: {
      default: `Use default import syntax to import '{{importName}}'.`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        for (const im of node.specifiers) {
          if ('importKind' in im && im.importKind === 'type') {
            continue
          }

          if (
            im.type === 'ImportSpecifier'
            && getValue(im.imported) === 'default'
          ) {
            context.report({
              node: im.local,
              messageId: 'default',
              data: {
                importName: im.local.name,
              },
            })
          }
        }
      },
    }
  },
})
