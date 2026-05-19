import path from 'node:path'
import type * as tsTypes from 'typescript'
import { ts } from '../typescript.js'

import { createRules } from '../create-rules.js'
import { createCssPropKey, normalizeCssObject } from '../css-props-helpers.js'
import type { CssPropCacheEntry } from '../css-cache.js'
import type { CSSObject } from '../types.js'
import {
  isLiteralExpressionValue,
  resolveLiteralExpression,
  type LiteralExpressionValue,
} from './resolve-expressions.js'

export { createCssPropKey } from '../css-props-helpers.js'
export type { CssPropCacheEntry } from '../css-cache.js'

export interface AnalyzeCssPropsOptions {
  tsConfigFilePath?: string
  program?: tsTypes.Program
}

export interface CssPropUsage {
  filePath: string
  position: {
    line: number
    column: number
  }
  key: string
  classNames: string
}

export interface AnalyzeCssPropsResult {
  cache: Record<string, CssPropCacheEntry>
  usages: CssPropUsage[]
}

/** Analyze the provided TypeScript program for `css` prop usages on JSX host elements. */
export function analyzeCssProps(
  options: AnalyzeCssPropsOptions
): AnalyzeCssPropsResult {
  const program =
    options.program ??
    (options.tsConfigFilePath
      ? createProgramFromConfig(options.tsConfigFilePath)
      : undefined)

  if (!program) {
    throw new Error(
      'analyzeCssProps requires either a program or a tsConfigFilePath option.'
    )
  }

  const checker = program.getTypeChecker()
  const cache: Record<string, CssPropCacheEntry> = Object.create(null)
  const usages: CssPropUsage[] = []

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) {
      continue
    }

    ts.forEachChild(sourceFile, function walk(node) {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        analyzeElement(node, sourceFile, checker, cache, usages)
      }

      ts.forEachChild(node, walk)
    })
  }

  return { cache, usages }
}

function analyzeElement(
  element: tsTypes.JsxOpeningLikeElement,
  sourceFile: tsTypes.SourceFile,
  checker: tsTypes.TypeChecker,
  cache: Record<string, CssPropCacheEntry>,
  usages: CssPropUsage[]
) {
  const tagNameNode = element.tagName

  if (!isHostElement(tagNameNode, checker)) {
    return
  }

  for (const attribute of element.attributes.properties) {
    if (!ts.isJsxAttribute(attribute)) {
      continue
    }

    if (attribute.name.getText() !== 'css') {
      continue
    }

    const initializer = attribute.initializer
    if (!initializer) {
      continue
    }

    let expression: tsTypes.Expression | undefined

    if (ts.isJsxExpression(initializer)) {
      expression = initializer.expression ?? undefined
    } else if (ts.isStringLiteral(initializer)) {
      // String literal css values are not supported by the analyzer.
      continue
    } else {
      continue
    }

    if (!expression) {
      continue
    }

    const resolved = resolveLiteralExpression(expression, checker)
    if (!isLiteralExpressionValue(resolved)) {
      continue
    }

    const cssObject = literalToCssObject(resolved)
    if (!cssObject) {
      continue
    }

    const normalizedStyles = normalizeCssObject(cssObject)
    const key = createCssPropKey(normalizedStyles)

    let entry = cache[key]
    if (!entry) {
      const [classNames, rules] = createRules(normalizedStyles)
      entry = { styles: normalizedStyles, classNames, rules }
      cache[key] = entry
    }

    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      attribute.name.getStart(sourceFile)
    )

    usages.push({
      filePath: sourceFile.fileName,
      position: { line: line + 1, column: character + 1 },
      key,
      classNames: entry.classNames,
    })
  }
}

function isHostElement(
  tagName: tsTypes.JsxTagNameExpression,
  checker: tsTypes.TypeChecker
): boolean {
  if (ts.isIdentifier(tagName)) {
    const text = tagName.text
    if (!text) {
      return false
    }

    const symbol = checker.getSymbolAtLocation(tagName)
    if (symbol && symbol.flags & ts.SymbolFlags.Function) {
      return false
    }

    const first = text[0]
    return Boolean(first && first === first.toLowerCase())
  }

  if (ts.isJsxNamespacedName(tagName)) {
    const namespace = tagName.namespace.text
    const name = tagName.name.text
    if (!namespace || !name) {
      return false
    }
    const namespaceFirst = namespace.charAt(0)
    const nameFirst = name.charAt(0)
    return (
      namespaceFirst !== '' &&
      nameFirst !== '' &&
      namespaceFirst === namespaceFirst.toLowerCase() &&
      nameFirst === nameFirst.toLowerCase()
    )
  }

  return false
}

function literalToCssObject(
  value: LiteralExpressionValue | LiteralExpressionValue[]
): CSSObject | null {
  if (Array.isArray(value)) {
    const merged: Record<string, any> = {}

    for (const item of value) {
      if (item == null || item === false) {
        continue
      }

      const css = literalToCssObject(item)
      if (!css) {
        return null
      }

      Object.assign(merged, css)
    }

    return merged as CSSObject
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return literalToCssObject(value)
    }

    return value as CSSObject
  }

  return null
}

function createProgramFromConfig(
  tsConfigFilePath: string
): tsTypes.Program {
  const configFile = ts.readConfigFile(tsConfigFilePath, ts.sys.readFile)
  if (configFile.error) {
    throw new Error(formatDiagnostic(configFile.error))
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsConfigFilePath)
  )

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors.map(formatDiagnostic).join('\n'))
  }

  return ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  })
}

function formatDiagnostic(diagnostic: tsTypes.Diagnostic): string {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

  if (diagnostic.file && typeof diagnostic.start === 'number') {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start
    )

    return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
  }

  return message
}
