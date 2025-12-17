import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema'
import { writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { camelCase, pascalCase } from 'change-case'
import { pluginsToRulesDTS } from 'eslint-typegen/core'
import { compile } from 'json-schema-to-typescript-lite'
import { globSync } from 'tinyglobby'
import plugin, { pluginName } from '../src/index'

const GEN_HEADER = '/* GENERATED, DO NOT EDIT DIRECTLY */'
const RULE_DIR = resolve('src/rules')

const rules = globSync('./src/rules/*', {
  onlyDirectories: true,
  absolute: true,
}).map((i) => basename(i))

async function writeRulesIndex() {
  const index = [
    GEN_HEADER,
    '',
    `import type { Rules } from '~/dts/rules'`,
    '',
    ...rules.map((i) => `import ${camelCase(i)} from './${i}/${i}'`),
    '',
    'export const rules = {',
    ...rules.map((i) => `  '${i}': ${camelCase(i)},`),
    '} satisfies Rules',
    '',
  ].join('\n')

  writeFileSync(resolve(RULE_DIR, 'index.ts'), index, 'utf-8')
}

function writeRuleMetaDts() {
  rules.forEach(async (name) => {
    const dir = resolve(RULE_DIR, name)
    const dtsFilename = resolve(dir, 'type.d.ts')

    const meta = await import(resolve(dir, `${name}.ts`)).then((r) => r.default.meta)

    const messageIds = Object.keys(meta.messages ?? {})
    let schemas = meta.schema as JSONSchema4[] ?? []
    if (!Array.isArray(schemas))
      schemas = [schemas]

    const prefix = pascalCase(name)

    const options = await Promise.all(schemas.map(async (schema, index) => {
      schema = JSON.parse(JSON.stringify(schema).replace(/#\/items\/0\/\$defs\//g, '#/$defs/'))

      try {
        const compiled = await compile(schema, `${prefix}Schema${index}`, {})
        return compiled
      } catch {
        console.warn(`Failed to compile schema Schema${index} for rule ${name}. Falling back to unknown.`)
        return `export type ${prefix}Schema${index} = unknown\n`
      }
    }))

    const optionTypes = options.map((_, index) => `${prefix}Schema${index}?`)
    const ruleOptionTypeValue = Array.isArray(meta.schema)
      ? `[${optionTypes.join(', ')}]`
      : meta.schema
        ? `${prefix}Schema0`
        : '[]'

    const lines = [
      GEN_HEADER,
      '',
      ...options,
      `export type ${prefix}RuleOptions = ${ruleOptionTypeValue}`,
      '',
      `export type RuleOptions = ${prefix}RuleOptions`,
      `export type MessageIds = ${messageIds.map((i) => `'${i}'`).join(' | ') || 'never'}`,
      '',
    ]

    writeFileSync(dtsFilename, lines.join('\n'), 'utf-8')
  })
}

async function writePluginType() {
  const dts = await pluginsToRulesDTS(
    {
      [pluginName]: plugin,
    },
    {
      includeAugmentation: false,
    },
  )
  writeFileSync(resolve('src/dts', 'rule-options.d.ts'), dts, 'utf-8')
}

console.log(['updating rules:', ...rules].join('\n'))
writeRulesIndex()
writeRuleMetaDts()
writePluginType()
