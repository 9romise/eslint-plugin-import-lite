import type { LiteralNodeValue } from '~/types'
import { isBuiltin } from 'node:module'
import path from 'node:path'
import { getFilePackagePath } from './package-path'
import { resolve } from './resolve'

/**
 * Returns the base module name.
 *
 * @example
 *   '@scope/package' => '@scope/package'
 *   '@scope/package/subpath' => '@scope/package'
 *   'package' => 'package'
 *   'package/subpath' => 'package'
 *   'package/subpath/index.js' => 'package'
 *
 * @param name The name of the module to check
 * @returns The base module name
 */
function baseModule(name: string) {
  if (isScoped(name)) {
    const [scope, pkg] = name.split('/')
    return `${scope}/${pkg}`
  }
  const [pkg] = name.split('/')
  return pkg
}

/**
 * Check if the name is an absolute path.
 *
 * @param name The name of the module to check
 * @returns `true` if the name is an absolute path, otherwise `false`
 */
function isAbsolute(name?: LiteralNodeValue) {
  return typeof name === 'string' && path.isAbsolute(name)
}

/**
 * Check if the name is a built-in module.
 *
 * A built-in module is a module that is included in Node.js by default.
 *
 * If `import-x/core-modules` are defined in the settings, it will also check
 * against those.
 *
 * @example
 *   'node:fs'
 *   'path'
 *
 * @param name The name of the module to check
 * @param modulePath The path of the module to check
 * @returns `true` if the name is a built-in module, otherwise `false`
 */
function isBuiltIn(name: string, modulePath?: string | null) {
  // path is defined only when a resolver resolves to a non-standard path
  if (modulePath || !name) {
    return false
  }
  const base = baseModule(name)
  return isBuiltin(base)
}

const moduleRegExp = /^\w/

/**
 * Check if the name could be a module name.
 *
 * This is a loose check that only checks if the name contains letters, numbers,
 * and underscores. It does not check if the name is a valid module name.
 *
 * @example
 *   'package' => true
 *
 *   '@scope/package' => false
 *   'package/subpath' => false
 *   './package' => false
 *   'package-name' => false
 *
 * @param name The name of the module to check
 * @returns `true` if the name only contains letters, numbers, and underscores,
 *   otherwise `false`
 */
function isModule(name: string) {
  return !!name && moduleRegExp.test(name)
}

const scopedRegExp = /^@[^/]+\/?[^/]+/

/**
 * Check if the name could be a scoped module name.
 *
 * @example
 *   '@scope/package' => true
 *
 *   '@/components/buttons' => false
 *
 * @param name The name of the module to check
 * @returns `true` if the name is a scoped module name, otherwise `false`
 */
function isScoped(name: string) {
  return !!name && scopedRegExp.test(name)
}

/**
 * Check if the name is a relative path to the parent module.
 *
 * @example
 *   '..' => true
 *   '../package' => true
 *
 *   './package' => false
 *   'package' => false
 *   '@scope/package' => false
 *
 * @param name The name of the module to check
 * @returns `true` if the name is a relative path to the parent module,
 *   otherwise `false`
 */
function isRelativeToParent(name: string) {
  return /^\.\.$|^\.\.[/\\]/.test(name)
}

const indexFiles = new Set(['.', './', './index', './index.js'])

/**
 * Check if the name is an index file.
 *
 * @example
 *   '.' => true
 *   './' => true
 *   './index' => true
 *   './index.js' => true
 *
 *   otherwise => false
 *
 * @param name The name of the module to check
 * @returns `true` if the name is an index file, otherwise `false`
 */
function isIndex(name: string) {
  return indexFiles.has(name)
}

/**
 * Check if the name is a relative path to a sibling module.
 *
 * @example
 *   './file.js' => true
 *
 *   '../file.js' => false
 *   'file.js' => false
 *
 * @param name The name of the module to check
 * @returns `true` if the name is a relative path to a sibling module, otherwise
 *   `false`
 */
function isRelativeToSibling(name: string) {
  return /^\.[/\\]/.test(name)
}

/**
 * Check if the path is an external path.
 *
 * An external path is a path that is outside of the package directory or the
 * `import-x/external-module-folders` settings.
 *
 * @param filepath The path to check
 * @param physicalFilename The physical path of the file
 * @returns `true` if the path is an external path, otherwise `false`
 */
function isExternalPath(filepath: string | null | undefined, physicalFilename: string) {
  if (!filepath) {
    return false
  }

  const packagePath = getFilePackagePath(physicalFilename)

  if (path.relative(packagePath, filepath).startsWith('..')) {
    return true
  }

  const folders = ['node_modules']
  return folders.some((folder) => {
    const folderPath = path.resolve(packagePath, folder)
    const relativePath = path.relative(folderPath, filepath)
    return !relativePath.startsWith('..')
  })
}

/**
 * Check if the path is an internal path.
 *
 * An internal path is a path that is inside the package directory.
 *
 * @param filepath The path to check
 * @param physicalFilename The physical path of the file
 * @returns `true` if the path is an internal path, otherwise `false`
 */
function isInternalPath(filepath: string | null | undefined, physicalFilename: string) {
  if (!filepath) {
    return false
  }
  const packagePath = getFilePackagePath(physicalFilename)
  return !path.relative(packagePath, filepath).startsWith('../')
}

/**
 * Check if the name is an external looking name.
 *
 * @example
 *   'glob' => true
 *   '@scope/package' => true
 *
 * @param name The name of the module to check
 * @returns `true` if the name is an external looking name, otherwise `false`
 */
export function isExternalLookingName(name: string) {
  return isModule(name) || isScoped(name)
}

/**
 * Returns the type of the module.
 *
 * @param name The name of the module to check
 * @param physicalFilename The physical path of the file
 * @param path The path of the module to check
 * @returns The type of the module
 */
function typeTest(name: LiteralNodeValue, physicalFilename: string, path?: string | null) {
  if (typeof name === 'string') {
    if (isAbsolute(name)) {
      return 'absolute'
    }
    if (isBuiltIn(name, path)) {
      return 'builtin'
    }
    if (isRelativeToParent(name)) {
      return 'parent'
    }
    if (isIndex(name)) {
      return 'index'
    }
    if (isRelativeToSibling(name)) {
      return 'sibling'
    }
  }
  if (isExternalPath(path, physicalFilename)) {
    return 'external'
  }
  if (isInternalPath(path, physicalFilename)) {
    return 'internal'
  }
  if (typeof name === 'string' && isExternalLookingName(name)) {
    return 'external'
  }
  return 'unknown'
}

/**
 * Returns the type of the module.
 *
 * @param name The name of the module to check
 * @param physicalFilename The physical path of the file
 * @returns The type of the module
 */
export function importType(name: LiteralNodeValue, physicalFilename: string) {
  return typeTest(name, physicalFilename, typeof name === 'string' ? resolve(name) : null)
}

export type ImportType = ReturnType<typeof importType>
