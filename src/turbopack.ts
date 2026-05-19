import path from 'node:path'

import {
  CSS_PROP_CACHE_MODULE_ID,
  writeCssPropCacheModule,
} from './plugin-cache.js'
import type { RestylePluginOptions } from './plugin-cache.js'

export interface RestyleTurbopackOptions extends RestylePluginOptions {
  /**
   * File Turbopack should resolve `restyle/css-prop-cache` to.
   */
  outputFilePath?: string
}

export interface NextLikeConfig {
  turbopack?: {
    resolveAlias?: Record<string, string>
    [key: string]: unknown
  }
  [key: string]: unknown
}

export function createRestyleTurbopackConfig(
  options: RestyleTurbopackOptions = {}
) {
  const root = path.resolve(options.root ?? process.cwd())
  const moduleId = options.moduleId ?? CSS_PROP_CACHE_MODULE_ID
  const outputFilePath = path.resolve(
    root,
    options.outputFilePath ?? '.restyle/css-prop-cache.mjs'
  )

  writeCssPropCacheModule(outputFilePath, {
    ...options,
    root,
    moduleId,
  })

  return {
    resolveAlias: {
      [moduleId]: outputFilePath,
    },
  }
}

export function withRestyleTurbopack<Config extends NextLikeConfig>(
  nextConfig: Config = {} as Config,
  options: RestyleTurbopackOptions = {}
): Config {
  const restyleConfig = createRestyleTurbopackConfig(options)

  return {
    ...nextConfig,
    turbopack: {
      ...nextConfig.turbopack,
      resolveAlias: {
        ...nextConfig.turbopack?.resolveAlias,
        ...restyleConfig.resolveAlias,
      },
    },
  }
}

export default withRestyleTurbopack
