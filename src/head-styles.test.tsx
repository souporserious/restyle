import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, test } from 'vitest'
import type * as tsTypes from 'typescript'
import { ts } from './typescript.js'

import { HeadStyles } from './head-styles.js'
import { clearGlobalCssCache, getGlobalCssCache } from './css-cache.js'

const isBrowserEnvironment = typeof document !== 'undefined'

function createTestProgram(files: Record<string, string>): tsTypes.Program {
  const options: tsTypes.CompilerOptions = {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  }

  const fileEntries = new Map<string, string>()

  for (const [fileName, content] of Object.entries(files)) {
    fileEntries.set(toVirtualPath(fileName), content)
  }

  const host = ts.createCompilerHost(options, true)
  const defaultGetSourceFile = host.getSourceFile.bind(host)
  const defaultReadFile = host.readFile?.bind(host)
  const defaultFileExists = host.fileExists?.bind(host)

  host.getSourceFile = (
    fileName,
    languageVersion,
    onError,
    shouldCreateNewSourceFile
  ) => {
    const normalized = toVirtualPath(fileName)
    const sourceText = fileEntries.get(normalized)

    if (sourceText !== undefined) {
      return ts.createSourceFile(
        fileName,
        sourceText,
        languageVersion,
        true,
        getScriptKindForFile(fileName)
      )
    }

    return defaultGetSourceFile(
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile
    )
  }

  host.readFile = (fileName) => {
    const normalized = toVirtualPath(fileName)
    if (fileEntries.has(normalized)) {
      return fileEntries.get(normalized)
    }

    return defaultReadFile?.(fileName)
  }

  host.fileExists = (fileName) => {
    const normalized = toVirtualPath(fileName)
    if (fileEntries.has(normalized)) {
      return true
    }

    return defaultFileExists?.(fileName) ?? false
  }

  host.getCurrentDirectory = () => '/'
  host.writeFile = () => {}

  return ts.createProgram({
    rootNames: Array.from(fileEntries.keys()),
    options,
    host,
  })
}

function toVirtualPath(fileName: string): string {
  const normalized = fileName.replace(/\\/g, '/')
  if (isAbsolutePath(normalized)) {
    return normalized
  }
  return `/${normalized.replace(/^\/+/, '')}`
}

function isAbsolutePath(fileName: string): boolean {
  return /^([a-zA-Z]:)?\//.test(fileName)
}

function getScriptKindForFile(fileName: string): tsTypes.ScriptKind {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.tsx')) {
    return ts.ScriptKind.TSX
  }
  if (lower.endsWith('.ts')) {
    return ts.ScriptKind.TS
  }
  if (lower.endsWith('.jsx')) {
    return ts.ScriptKind.JSX
  }
  if (lower.endsWith('.js')) {
    return ts.ScriptKind.JS
  }
  return ts.ScriptKind.Unknown
}

if (!isBrowserEnvironment) {
  afterEach(() => {
    clearGlobalCssCache()
  })
}

describe.runIf(!isBrowserEnvironment)('HeadStyles', () => {
  test('analyzes css props and registers cache globally', () => {
    const program = createTestProgram({
      'component.tsx': `
        export function Component() {
          return <div css={{ color: 'red', ':hover': { color: 'blue' } }} />
        }
      `,
    })

    const markup = renderToStaticMarkup(
      React.createElement(HeadStyles, { program })
    )

    const cache = getGlobalCssCache()
    expect(cache).toBeDefined()
    if (!cache) {
      throw new Error('Expected the global css cache to be populated')
    }
    expect(Object.keys(cache.entries)).toHaveLength(1)
    expect(markup).toContain('color:red')
    expect(markup).toContain(':hover')
  })

  test('deduplicates class names across usages', () => {
    const program = createTestProgram({
      'a.tsx': `
        export function ComponentA() {
          return <div css={{ color: 'purple' }} />
        }
      `,
      'b.tsx': `
        export function ComponentB() {
          return <span css={{ color: 'purple' }} />
        }
      `,
    })

    const markup = renderToStaticMarkup(
      React.createElement(HeadStyles, { program })
    )

    const purpleRules = markup.match(/color:purple/g) ?? []
    expect(purpleRules).toHaveLength(1)
  })

  test('renders empty precedence anchors for missing rule buckets', () => {
    const program = createTestProgram({
      'component.tsx': `
        export function Component() {
          return <div css={{ color: 'red' }} />
        }
      `,
    })

    const markup = renderToStaticMarkup(
      React.createElement(HeadStyles, { program })
    )

    const lowIndex = markup.indexOf('href="rsli"')
    const mediumIndex = markup.indexOf('href="rsmi"')
    const highIndex = markup.indexOf('color:red')

    expect(lowIndex).toBeGreaterThanOrEqual(0)
    expect(mediumIndex).toBeGreaterThan(lowIndex)
    expect(highIndex).toBeGreaterThan(mediumIndex)
  })
})
