import { describe, test, expect } from 'vitest'
import type * as tsTypes from 'typescript'
import { ts } from '../typescript.js'

import {
  resolveLiteralExpression,
  resolveArrayLiteralExpression,
  resolveObjectLiteralExpression,
} from './resolve-expressions.js'

const isBrowserEnvironment = typeof document !== 'undefined'

function createTestProgram(files: Record<string, string>): tsTypes.Program {
  const options: tsTypes.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    jsx: ts.JsxEmit.ReactJSX,
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

function isNullLiteral(node: tsTypes.Node): node is tsTypes.NullLiteral {
  return node.kind === ts.SyntaxKind.NullKeyword
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

function getSourceFile(
  program: tsTypes.Program,
  fileName: string
): tsTypes.SourceFile {
  const source = program.getSourceFile(toVirtualPath(fileName))
  if (!source) {
    throw new Error(`Source file not found: ${fileName}`)
  }
  return source
}

function findFirstDescendant<T extends tsTypes.Node>(
  node: tsTypes.Node,
  predicate: (node: tsTypes.Node) => node is T
): T | undefined {
  if (predicate(node)) {
    return node
  }

  return node.forEachChild((child) => findFirstDescendant(child, predicate))
}

function expectNode<T extends tsTypes.Node>(
  value: T | undefined,
  message: string
): T {
  if (!value) {
    throw new Error(message)
  }

  return value
}

function getVariableInitializer(
  sourceFile: tsTypes.SourceFile,
  name: string
): tsTypes.Expression {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        if (!declaration.initializer) {
          throw new Error(`Variable ${name} has no initializer`)
        }

        return declaration.initializer
      }
    }
  }

  throw new Error(`Variable not found: ${name}`)
}

describe.runIf(!isBrowserEnvironment)('resolveLiteralExpression', () => {
  test('null literals', () => {
    const program = createTestProgram({ 'test.ts': 'const test = null;' })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const nullLiteral = expectNode(
      findFirstDescendant(sourceFile, isNullLiteral),
      'Expected to find null literal'
    )

    expect(resolveLiteralExpression(nullLiteral, checker)).toBeNull()
  })

  test('boolean literals', () => {
    const program = createTestProgram({ 'test.ts': 'const test = true;' })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const trueLiteral = expectNode(
      findFirstDescendant(
        sourceFile,
        (node): node is tsTypes.TrueLiteral =>
          node.kind === ts.SyntaxKind.TrueKeyword
      ),
      'Expected to find true literal'
    )

    expect(resolveLiteralExpression(trueLiteral, checker)).toBe(true)
  })

  test('numeric literals', () => {
    const program = createTestProgram({ 'test.ts': 'const test = 123;' })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const numericLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isNumericLiteral),
      'Expected to find numeric literal'
    )

    expect(resolveLiteralExpression(numericLiteral, checker)).toBe(123)
  })

  test('string literals', () => {
    const program = createTestProgram({ 'test.ts': "const test = 'test';" })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const stringLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isStringLiteral),
      'Expected to find string literal'
    )

    expect(resolveLiteralExpression(stringLiteral, checker)).toBe('test')
  })

  test('object literal expressions', () => {
    const program = createTestProgram({
      'test.ts': "const test = { property: 'test' };",
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )

    expect(resolveLiteralExpression(objectLiteral, checker)).toEqual({
      property: 'test',
    })
  })

  test('array literal expressions', () => {
    const program = createTestProgram({
      'test.ts': 'const test = [1, 2, 3];',
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const arrayLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isArrayLiteralExpression),
      'Expected to find array literal'
    )

    expect(resolveLiteralExpression(arrayLiteral, checker)).toEqual([1, 2, 3])
  })

  test('identifiers', () => {
    const program = createTestProgram({
      'test.ts': 'const test = 123; const anotherTest = test;',
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const initializer = getVariableInitializer(sourceFile, 'anotherTest')

    expect(resolveLiteralExpression(initializer, checker)).toBe(123)
  })

  test('identifiers across files', () => {
    const program = createTestProgram({
      'foo.ts': 'export const foo = 123;',
      'test.ts': `import { foo } from './foo.ts'; const anotherTest = foo;`,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const initializer = getVariableInitializer(sourceFile, 'anotherTest')

    expect(resolveLiteralExpression(initializer, checker)).toBe(123)
  })

  test('reused identifiers are not treated as cycles', () => {
    const program = createTestProgram({
      'test.ts': `
        const color = 'red';
        const object = { color, borderColor: color };
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const initializer = getVariableInitializer(sourceFile, 'object')

    expect(resolveLiteralExpression(initializer, checker)).toEqual({
      color: 'red',
      borderColor: 'red',
    })
  })

  test('as const values', () => {
    const program = createTestProgram({
      'test.ts': 'const test = 123 as const;',
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const initializer = getVariableInitializer(sourceFile, 'test')

    expect(resolveLiteralExpression(initializer, checker)).toBe(123)
  })

  test('conditional expressions', () => {
    const program = createTestProgram({
      'test.ts': `
        const test = true ? { color: 'red' } : { color: 'blue' };
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const initializer = getVariableInitializer(sourceFile, 'test')

    expect(resolveLiteralExpression(initializer, checker)).toEqual({
      color: 'red',
    })
  })

  test('logical expressions', () => {
    const program = createTestProgram({
      'test.ts': `
        const truthy = true;
        const falsy = false;
        const withAnd = truthy && { color: 'red' };
        const withOr = falsy || { color: 'blue' };
        const withNullish = undefined ?? { color: 'green' };
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')

    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'withAnd'),
        checker
      )
    ).toEqual({
      color: 'red',
    })
    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'withOr'),
        checker
      )
    ).toEqual({
      color: 'blue',
    })
    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'withNullish'),
        checker
      )
    ).toEqual({ color: 'green' })
  })

  test('property access expressions', () => {
    const program = createTestProgram({
      'test.ts': `
        const palette = { primary: { color: 'plum' } } as const;
        const styles = palette.primary;
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')

    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'styles'),
        checker
      )
    ).toEqual({ color: 'plum' })
  })

  test('element access expressions', () => {
    const program = createTestProgram({
      'test.ts': `
        const palette = { primary: { color: 'plum' }, 0: { color: 'teal' } } as const;
        const byName = palette['primary'];
        const byIndex = [palette[0]][0];
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')

    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'byName'),
        checker
      )
    ).toEqual({ color: 'plum' })
    expect(
      resolveLiteralExpression(
        getVariableInitializer(sourceFile, 'byIndex'),
        checker
      )
    ).toEqual({ color: 'teal' })
  })
})

describe.runIf(!isBrowserEnvironment)('resolveArrayLiteralExpression', () => {
  test('array literal expressions', () => {
    const program = createTestProgram({
      'test.ts': 'const array = [1, 2, 3];',
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const arrayLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isArrayLiteralExpression),
      'Expected to find array literal'
    )
    const array = resolveArrayLiteralExpression(arrayLiteral, checker)

    expect(array).toEqual([1, 2, 3])
  })

  test('nested array literal expressions', () => {
    const program = createTestProgram({
      'test.ts': 'const array = [[1], [2], [3]];',
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const arrayLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isArrayLiteralExpression),
      'Expected to find array literal'
    )
    const array = resolveArrayLiteralExpression(arrayLiteral, checker)

    expect(array).toEqual([[1], [2], [3]])
  })
})

describe.runIf(!isBrowserEnvironment)('resolveObjectLiteralExpression', () => {
  test('property assignments', () => {
    const program = createTestProgram({
      'test.ts': "const object = { property: 'test' };",
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )
    const object = resolveObjectLiteralExpression(objectLiteral, checker)

    expect(object).toEqual({ property: 'test' })
  })

  test('nested property assignments', () => {
    const program = createTestProgram({
      'test.ts': "const object = { nested: { property: 'test' } };",
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )
    const object = resolveObjectLiteralExpression(objectLiteral, checker)

    expect(object).toEqual({ nested: { property: 'test' } })
  })

  test('spread assignments', () => {
    const program = createTestProgram({
      'test.ts':
        "const spread = { spread: 'test' };\nconst object = { ...spread };",
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )
    const object = resolveObjectLiteralExpression(objectLiteral, checker)

    expect(object).toEqual({ spread: 'test' })
  })

  test('spread assignments without identifier', () => {
    const program = createTestProgram({
      'test.ts': "const object = { ...{ spread: 'test' } };",
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )
    const object = resolveObjectLiteralExpression(objectLiteral, checker)

    expect(object).toEqual({ spread: 'test' })
  })

  test('shorthand assignments', () => {
    const program = createTestProgram({
      'test.ts': `
        const color = 'red';
        const object = { color };
      `,
    })
    const checker = program.getTypeChecker()
    const sourceFile = getSourceFile(program, 'test.ts')
    const objectLiteral = expectNode(
      findFirstDescendant(sourceFile, ts.isObjectLiteralExpression),
      'Expected to find object literal'
    )
    const object = resolveObjectLiteralExpression(objectLiteral, checker)

    expect(object).toEqual({ color: 'red' })
  })
})
