import { describe, expect, test } from 'vitest'
import type * as tsTypes from 'typescript'
import { ts } from '../typescript.js'

import {
  analyzeCssProps,
  createCssPropKey,
} from './index.js'
import type { AnalyzeCssPropsResult } from './index.js'

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

function expectUsageCount(
  result: AnalyzeCssPropsResult,
  count: number
): void {
  expect(result.usages).toHaveLength(count)
}

function expectDefined<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message)
  }

  return value
}

describe.runIf(!isBrowserEnvironment)('analyzeCssProps', () => {
  test('collects css props on host elements', () => {
    const program = createTestProgram({
      'styles.ts': `export const base = { color: 'blue' }`,
      'component.tsx': `import { base } from './styles.ts'

      export function Component() {
        return <div css={{ backgroundColor: 'orange', ...base }} />
      }
      `,
    })

    const result = analyzeCssProps({ program })
    expectUsageCount(result, 1)

    const usage = expectDefined(
      result.usages[0],
      'Expected a css prop usage entry'
    )
    expect(usage.filePath.endsWith('component.tsx')).toBe(true)

    const cacheKeys = Object.keys(result.cache)
    expect(cacheKeys).toHaveLength(1)

    const key = expectDefined(cacheKeys[0], 'Expected a css prop cache key')
    const entry = expectDefined(
      result.cache[key],
      'Expected a cache entry for the css prop key'
    )
    expect(entry.styles).toEqual({
      backgroundColor: 'orange',
      color: 'blue',
    })
    expect(usage.classNames).toBe(entry.classNames)
    expect(entry.classNames.length).toBeGreaterThan(0)
  })

  test('ignores non-host elements', () => {
    const program = createTestProgram({
      'component.tsx': `const Box = (props: any) => <div {...props} />

      export function Component() {
        return <Box css={{ color: 'red' }} />
      }
      `,
    })

    const result = analyzeCssProps({ program })
    expectUsageCount(result, 0)
  })

  test('deduplicates identical css objects', () => {
    const program = createTestProgram({
      'component-a.tsx': `export function ComponentA() {
        return <div css={{ color: 'red', backgroundColor: 'blue' }} />
      }
      `,
      'component-b.tsx': `export function ComponentB() {
        return <div css={{ backgroundColor: 'blue', color: 'red' }} />
      }
      `,
    })

    const result = analyzeCssProps({ program })
    const cacheKeys = Object.keys(result.cache)
    expect(cacheKeys).toHaveLength(1)
    expectUsageCount(result, 2)
    const key = expectDefined(cacheKeys[0], 'Expected a css prop cache key')
    expect(result.usages.map((usage) => usage.key)).toEqual([key, key])

    const entry = expectDefined(
      result.cache[key],
      'Expected a cache entry for the css prop key'
    )
    expect(createCssPropKey(entry.styles)).toBe(key)
  })

  test('resolves array css values with spreads and conditionals', () => {
    const program = createTestProgram({
      'styles.ts': `
        const palette = { base: { color: 'blue' } } as const;
        const mixes = [
          { borderColor: 'black' },
          null,
          false && { display: 'none' },
        ] as const;

        export { palette, mixes };
      `,
      'component.tsx': `
        import { palette, mixes } from './styles.ts';

        export function Component() {
          return (
            <div
              css={[
                palette.base,
                true && { backgroundColor: 'orange' },
                ...mixes,
              ]}
            />
          )
        }
      `,
    })

    const result = analyzeCssProps({ program })
    expectUsageCount(result, 1)

    const usage = expectDefined(
      result.usages[0],
      'Expected a css prop usage entry'
    )
    const entry = expectDefined(
      result.cache[usage.key],
      'Expected a cache entry for the css prop key'
    )
    expect(entry.styles).toEqual({
      backgroundColor: 'orange',
      borderColor: 'black',
      color: 'blue',
    })
  })

  test('supports nested selectors and at-rules', () => {
    const program = createTestProgram({
      'component.tsx': `
        export function Component() {
          return (
            <div
              css={{
                color: 'black',
                ':hover': { color: 'orange' },
                '@media (min-width: 768px)': {
                  color: 'purple',
                  ':focus': { color: 'teal' },
                },
              }}
            />
          )
        }
      `,
    })

    const result = analyzeCssProps({ program })
    expectUsageCount(result, 1)
    const usage = expectDefined(
      result.usages[0],
      'Expected a css prop usage entry'
    )
    const entry = expectDefined(
      result.cache[usage.key],
      'Expected a cache entry for the css prop key'
    )

    expect(entry.styles).toMatchObject({
      color: 'black',
      ':hover': { color: 'orange' },
      '@media (min-width: 768px)': {
        color: 'purple',
        ':focus': { color: 'teal' },
      },
    })
  })

  test('resolves property access and shorthands', () => {
    const program = createTestProgram({
      'tokens.ts': `
        export const palette = { surface: { backgroundColor: 'lavender' } } as const;
      `,
      'component.tsx': `
        import { palette } from './tokens.ts';

        export function Component() {
          const color = 'maroon';
          return <div css={{ color, ...palette.surface }} />
        }
      `,
    })

    const result = analyzeCssProps({ program })
    expectUsageCount(result, 1)
    const usage = expectDefined(
      result.usages[0],
      'Expected a css prop usage entry'
    )
    const entry = expectDefined(
      result.cache[usage.key],
      'Expected a cache entry for the css prop key'
    )

    expect(entry.styles).toEqual({
      backgroundColor: 'lavender',
      color: 'maroon',
    })
  })
})
