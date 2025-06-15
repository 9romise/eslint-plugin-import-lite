import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { camelCase } from 'change-case'
import { globSync } from 'tinyglobby'

const RULE_DIR = resolve('src/rules')

const rules = globSync('**/*.ts', {
  cwd: 'src/rules',
  ignore: ['**/*.test.ts', 'index.ts'],
}).map((i) => i.split('/')[0])

export async function writeRulesIndex() {
  const index = [
    '/* GENERATED, DO NOT EDIT DIRECTLY */',
    '',
    `import type { ESLintRuleModule } from '~/utils'`,
    '',
    ...rules.map((i) => `import ${camelCase(i)} from './${i}/${i}'`),
    '',
    'export const rules: Record<string, ESLintRuleModule<unknown[], string>> = {',
    ...rules.map((i) => `  '${i}': ${camelCase(i)},`),
    '}',
    '',
  ].join('\n')

  writeFileSync(resolve(RULE_DIR, `index.ts`), index, 'utf-8')
}

writeRulesIndex()
