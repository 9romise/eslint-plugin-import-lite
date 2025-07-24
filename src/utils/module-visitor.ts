import type { RuleListener, Tree } from '~/types'

export type Visitor = (
  source: Tree.StringLiteral,
  importer:
    | Tree.ImportDeclaration
    | Tree.ExportNamedDeclaration
    | Tree.ExportAllDeclaration
    | Tree.CallExpression
    | Tree.ImportExpression
    | Tree.StringLiteral,
) => void

export interface ModuleOptions {
  amd?: boolean
  commonjs?: boolean
  esmodule?: boolean
  ignore?: string[]
}

/**
 * Returns an object of node visitors that will call 'visitor' with every
 * discovered module path.
 */
export function moduleVisitor(visitor: Visitor, options?: ModuleOptions) {
  const {
    ignore,
    amd = false,
    commonjs = false,
    esmodule = true,
  } = options ?? {}

  const ignoreRegExps = ignore == null ? [] : ignore.map((p) => new RegExp(p))

  function checkSourceValue(
    source: Tree.StringLiteral | null | undefined,
    importer:
      | Tree.ImportDeclaration
      | Tree.ExportNamedDeclaration
      | Tree.ExportAllDeclaration
      | Tree.CallExpression
      | Tree.ImportExpression
      | Tree.StringLiteral,
  ) {
    if (source == null) {
      return
    }

    // handle ignore
    if (ignoreRegExps.some((re) => re.test(String(source.value)))) {
      return
    }

    // fire visitor
    visitor(source, importer)
  }

  // for import-y declarations
  function checkSource(
    node:
      | Tree.ImportDeclaration
      | Tree.ExportNamedDeclaration
      | Tree.ExportAllDeclaration,
  ) {
    checkSourceValue(node.source, node)
  }

  // for esmodule dynamic `import()` calls
  function checkImportCall(node: Tree.Node) {
    let modulePath
    // refs https://github.com/estree/estree/blob/HEAD/es2020.md#importexpression
    if (node.type === 'ImportExpression') {
      modulePath = node.source
    } else if (node.type === 'CallExpression') {
      // @ts-expect-error this structure is from an older version of eslint
      if (node.callee.type !== 'Import') {
        return
      }
      if (node.arguments.length !== 1) {
        return
      }

      modulePath = node.arguments[0]
    } else {
      throw new TypeError('this should be unreachable')
    }

    if (modulePath.type !== 'Literal') {
      return
    }

    if (typeof modulePath.value !== 'string') {
      return
    }

    checkSourceValue(modulePath, node)
  }

  // for CommonJS `require` calls
  // adapted from @mctep: https://git.io/v4rAu
  function checkCommon(call: Tree.CallExpression) {
    if (call.callee.type !== 'Identifier') {
      return
    }
    if (call.callee.name !== 'require') {
      return
    }
    if (call.arguments.length !== 1) {
      return
    }

    const modulePath = call.arguments[0]

    if (modulePath.type !== 'Literal') {
      return
    }
    if (typeof modulePath.value !== 'string') {
      return
    }

    checkSourceValue(modulePath, call)
  }

  function checkAMD(call: Tree.CallExpression) {
    if (call.callee.type !== 'Identifier') {
      return
    }
    if (call.callee.name !== 'require' && call.callee.name !== 'define') {
      return
    }
    if (call.arguments.length !== 2) {
      return
    }

    const modules = call.arguments[0]
    if (modules.type !== 'ArrayExpression') {
      return
    }

    for (const element of modules.elements) {
      if (!element) {
        continue
      }

      if (element.type !== 'Literal') {
        continue
      }

      if (typeof element.value !== 'string') {
        continue
      }

      if (element.value === 'require' || element.value === 'exports') {
        continue // magic modules: https://github.com/requirejs/requirejs/wiki/Differences-between-the-simplified-CommonJS-wrapper-and-standard-AMD-define#magic-modules
      }

      checkSourceValue(element, element)
    }
  }

  const visitors = {} as RuleListener

  if (esmodule) {
    Object.assign(visitors, {
      ImportDeclaration: checkSource,
      ExportNamedDeclaration: checkSource,
      ExportAllDeclaration: checkSource,
      CallExpression: checkImportCall,
      ImportExpression: checkImportCall,
    })
  }

  if (commonjs || amd) {
    const currentCallExpression = visitors.CallExpression
    visitors.CallExpression = function (call) {
      if (currentCallExpression) {
        currentCallExpression(call)
      }
      if (commonjs) {
        checkCommon(call)
      }
      if (amd) {
        checkAMD(call)
      }
    }
  }

  return visitors
}
