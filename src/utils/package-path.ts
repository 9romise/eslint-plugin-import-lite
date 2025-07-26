import path from 'node:path'
import { findUpPkg } from './find-up'

export function getFilePackagePath(filename: string) {
  return path.dirname(findUpPkg({ cwd: filename })!)
}
