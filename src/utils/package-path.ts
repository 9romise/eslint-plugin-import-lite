import type { RuleContext } from '~/types'
import path from 'node:path'
import { findUpPkg } from './find-up'

export function getContextPackagePath(context: RuleContext) {
  return getFilePackagePath(context.physicalFilename)
}

export function getFilePackagePath(filename: string) {
  return path.dirname(findUpPkg({ cwd: filename })!)
}
