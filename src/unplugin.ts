import { createUnplugin } from 'unplugin'

import {
  CSS_PROP_CACHE_MODULE_ID,
  VIRTUAL_CSS_PROP_CACHE_MODULE_ID,
  createCssPropCacheModule,
  resolveRestylePluginOptions,
} from './plugin-cache.js'
import type { RestylePluginOptions } from './plugin-cache.js'

export type RestylePluginFactory = (options?: RestylePluginOptions) => unknown

export interface RestyleRawPlugin {
  name: 'restyle'
  enforce: 'pre'
  buildStart?: (this: { addWatchFile?: (id: string) => void }) => void
  resolveId: (
    id: string,
    importer?: string,
    options?: { isEntry?: boolean }
  ) => string | null
  load: (id: string) => string | null
  watchChange?: () => void
}

export interface RestyleUnplugin {
  raw: (options?: RestylePluginOptions, meta?: unknown) => RestyleRawPlugin
  vite: RestylePluginFactory
  rollup: RestylePluginFactory
  rolldown: RestylePluginFactory
  webpack: RestylePluginFactory
  rspack: RestylePluginFactory
  esbuild: RestylePluginFactory
}

export const restyleUnplugin = createUnplugin<RestylePluginOptions | undefined>(
  (options = {}) => {
    const resolvedOptions = resolveRestylePluginOptions(options)
    let generatedModuleCode: string | undefined

    function loadGeneratedModule() {
      generatedModuleCode ??= createCssPropCacheModule(resolvedOptions).code
      return generatedModuleCode
    }

    return {
      name: 'restyle',
      enforce: 'pre',
      buildStart() {
        const generatedModule = createCssPropCacheModule(resolvedOptions)
        generatedModuleCode = generatedModule.code
        const tsConfigFilePath = generatedModule.tsConfigFilePath

        if (tsConfigFilePath) {
          this.addWatchFile?.(tsConfigFilePath)
        }
      },
      resolveId(id) {
        if (
          id === resolvedOptions.moduleId ||
          id === CSS_PROP_CACHE_MODULE_ID ||
          id === VIRTUAL_CSS_PROP_CACHE_MODULE_ID
        ) {
          return VIRTUAL_CSS_PROP_CACHE_MODULE_ID
        }

        return null
      },
      load(id) {
        if (id === VIRTUAL_CSS_PROP_CACHE_MODULE_ID) {
          return loadGeneratedModule()
        }

        return null
      },
      watchChange() {
        generatedModuleCode = undefined
      },
    }
  }
) as RestyleUnplugin

export default restyleUnplugin
