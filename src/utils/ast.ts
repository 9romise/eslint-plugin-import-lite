import type { TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/types'

export function getValue(node: TSESTree.Identifier | TSESTree.StringLiteral) {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier: {
      return node.name
    }
    case AST_NODE_TYPES.Literal: {
      return node.value
    }
    default: {
      throw new Error(`Unsupported node type: ${(node as TSESTree.Node).type}`)
    }
  }
}
