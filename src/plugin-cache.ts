import fs from 'node:fs'
import path from 'node:path'

import { analyzeCssProps } from './analyze-css-props/index.js'
import type {
  AnalyzeCssPropsOptions,
  AnalyzeCssPropsResult,
} from './analyze-css-props/index.js'

export const CSS_PROP_CACHE_MODULE_ID = 'restyle/css-prop-cache'
export const VIRTUAL_CSS_PROP_CACHE_MODULE_ID = '\0restyle/css-prop-cache'

export interface RestylePluginOptions extends AnalyzeCssPropsOptions {
  /**
   * Project root used to resolve tsconfig and generated output paths.
   */
  root?: string
  /**
   * Public module id the plugin should resolve to the generated cache module.
   */
  moduleId?: string
}

export interface CssPropCacheModuleResult extends AnalyzeCssPropsResult {
  code: string
  tsConfigFilePath: string | undefined
}

export interface WriteCssPropCacheModuleResult extends CssPropCacheModuleResult {
  outputFilePath: string
}

export function resolveRestylePluginOptions(
  options: RestylePluginOptions = {}
) {
  const root = path.resolve(options.root ?? process.cwd())
  const tsConfigFilePath =
    options.program || options.tsConfigFilePath === undefined
      ? options.tsConfigFilePath
      : path.resolve(root, options.tsConfigFilePath)

  return {
    ...options,
    root,
    tsConfigFilePath,
    moduleId: options.moduleId ?? CSS_PROP_CACHE_MODULE_ID,
  }
}

export function createCssPropCacheModule(
  options: RestylePluginOptions = {}
): CssPropCacheModuleResult {
  const resolvedOptions = resolveRestylePluginOptions(options)
  const analysis = analyzeCssProps({
    program: resolvedOptions.program,
    tsConfigFilePath:
      resolvedOptions.program || resolvedOptions.tsConfigFilePath
        ? resolvedOptions.tsConfigFilePath
        : path.join(resolvedOptions.root, 'tsconfig.json'),
  })

  return {
    ...analysis,
    tsConfigFilePath:
      resolvedOptions.tsConfigFilePath ??
      (resolvedOptions.program
        ? undefined
        : path.join(resolvedOptions.root, 'tsconfig.json')),
    code: serializeCssPropCacheModule(analysis),
  }
}

export function writeCssPropCacheModule(
  outputFilePath: string,
  options: RestylePluginOptions = {}
): WriteCssPropCacheModuleResult {
  const resolvedOptions = resolveRestylePluginOptions(options)
  const absoluteOutputFilePath = path.resolve(
    resolvedOptions.root,
    outputFilePath
  )
  const result = createCssPropCacheModule(resolvedOptions)

  fs.mkdirSync(path.dirname(absoluteOutputFilePath), { recursive: true })
  fs.writeFileSync(absoluteOutputFilePath, result.code)

  return {
    ...result,
    outputFilePath: absoluteOutputFilePath,
  }
}

function serializeCssPropCacheModule(result: AnalyzeCssPropsResult): string {
  return [
    `export const cache = ${JSON.stringify(result.cache, null, 2)}`,
    `export const usages = ${JSON.stringify(result.usages, null, 2)}`,
    'export default cache',
    '',
  ].join('\n')
}
