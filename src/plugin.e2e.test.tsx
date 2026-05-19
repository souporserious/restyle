import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test } from 'vitest'

import { clearGlobalCssCache, getGlobalCssCache } from './css-cache.js'
import { css } from './css.js'
import { HeadStyles } from './head-styles.js'
import { CSS_PROP_CACHE_MODULE_ID } from './plugin-cache.js'
import EsbuildPlugin from './esbuild.js'
import RollupPlugin from './rollup.js'
import RspackPlugin from './rspack.js'
import {
  createRestyleTurbopackConfig,
  withRestyleTurbopack,
} from './turbopack.js'
import RestyleUnplugin from './unplugin.js'
import VitePlugin from './vite.js'
import WebpackPlugin from './webpack.js'

const isBrowserEnvironment = typeof document !== 'undefined'

interface Fixture {
  root: string
  tsConfigFilePath: string
}

function createFixture(): Fixture {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'restyle-plugin-'))
  const sourceDirectory = path.join(root, 'src')
  fs.mkdirSync(sourceDirectory, { recursive: true })

  fs.writeFileSync(
    path.join(root, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ESNext',
        },
        include: ['src/**/*'],
      },
      null,
      2
    )
  )

  fs.writeFileSync(
    path.join(sourceDirectory, 'component.tsx'),
    `
      export function Component() {
        return (
          <div css={{ color: 'tomato', ':hover': { color: 'blue' } }}>
            Hello
          </div>
        )
      }
    `
  )

  return {
    root,
    tsConfigFilePath: path.join(root, 'tsconfig.json'),
  }
}

async function importGeneratedModule(
  code: string,
  root: string,
  fileName = 'generated-css-prop-cache.mjs'
) {
  const modulePath = path.join(root, fileName)
  fs.writeFileSync(modulePath, code)

  return import(
    `${pathToFileURL(modulePath).href}?updated=${Date.now().toString()}`
  ) as Promise<{
    cache: React.ComponentProps<typeof HeadStyles>['cache']
    usages: unknown[]
  }>
}

if (!isBrowserEnvironment) {
  afterEach(() => {
    clearGlobalCssCache()
  })
}

describe.runIf(!isBrowserEnvironment)('restyle build plugins', () => {
  test('unplugin generates a cache module consumed by HeadStyles and css', async () => {
    const fixture = createFixture()
    const plugin = RestyleUnplugin.raw({
      root: fixture.root,
      tsConfigFilePath: 'tsconfig.json',
    })

    const watchedFiles: string[] = []
    plugin.buildStart?.call({
      addWatchFile(id: string) {
        watchedFiles.push(id)
      },
    })

    const resolvedId = plugin.resolveId(CSS_PROP_CACHE_MODULE_ID)
    expect(resolvedId).toBe('\0restyle/css-prop-cache')

    const moduleCode = plugin.load(resolvedId ?? '')
    expect(moduleCode).toContain('export const cache')
    expect(watchedFiles).toContain(fixture.tsConfigFilePath)

    const generated = await importGeneratedModule(
      moduleCode ?? '',
      fixture.root
    )
    expect(generated.usages).toHaveLength(1)

    const markup = renderToStaticMarkup(
      React.createElement(HeadStyles, { cache: generated.cache })
    )
    expect(markup).toContain('color:tomato')
    expect(markup).toContain(':hover')

    const globalCache = getGlobalCssCache()
    expect(globalCache).toBeDefined()

    const [classNames, Styles] = css({
      color: 'tomato',
      ':hover': { color: 'blue' },
    })

    const cachedEntry = Object.values(generated.cache ?? {})[0]
    expect(cachedEntry).toBeDefined()
    expect(classNames).toBe(cachedEntry?.classNames)
    expect(Styles).toBeNull()
  })

  test('bundler-specific unplugin wrappers are exported', () => {
    expect(typeof VitePlugin).toBe('function')
    expect(typeof RollupPlugin).toBe('function')
    expect(typeof WebpackPlugin).toBe('function')
    expect(typeof RspackPlugin).toBe('function')
    expect(typeof EsbuildPlugin).toBe('function')
  })

  test('turbopack adapter writes a cache module and merges resolve aliases', async () => {
    const fixture = createFixture()
    const outputFilePath = path.join(fixture.root, '.restyle/cache.mjs')
    const turbopackConfig = createRestyleTurbopackConfig({
      root: fixture.root,
      tsConfigFilePath: 'tsconfig.json',
      outputFilePath,
    })

    expect(turbopackConfig.resolveAlias[CSS_PROP_CACHE_MODULE_ID]).toBe(
      outputFilePath
    )
    expect(fs.existsSync(outputFilePath)).toBe(true)

    const generated = await import(
      `${pathToFileURL(outputFilePath).href}?updated=${Date.now().toString()}`
    )
    expect(Object.keys(generated.cache)).toHaveLength(1)

    const nextConfig = withRestyleTurbopack(
      {
        turbopack: {
          resolveAlias: {
            existing: '/tmp/existing',
          },
        },
      },
      {
        root: fixture.root,
        tsConfigFilePath: 'tsconfig.json',
        outputFilePath,
      }
    )

    expect(nextConfig.turbopack?.resolveAlias?.existing).toBe('/tmp/existing')
    const resolveAlias = nextConfig.turbopack?.resolveAlias as
      | Record<string, string>
      | undefined
    expect(resolveAlias?.[CSS_PROP_CACHE_MODULE_ID]).toBe(outputFilePath)
  })
})
