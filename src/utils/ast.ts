import type { AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import type { Tree } from '~/types'

type PunctuatorToken<T extends string> = Tree.Token & {
  type: AST_TOKEN_TYPES.Punctuator
  value: T
}

export function isCommaToken(token: Tree.Token): token is PunctuatorToken<','> {
  return token.type === 'Punctuator' && token.value === ','
}

export function getValue(node: Tree.Identifier | Tree.StringLiteral) {
  switch (node.type) {
    case 'Identifier': {
      return node.name
    }
    case 'Literal': {
      return node.value
    }
    default: {
      throw new Error(`Unsupported node type: ${(node as Tree.Node).type}`)
    }
  }
}
