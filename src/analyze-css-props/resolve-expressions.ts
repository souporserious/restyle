import type * as tsTypes from 'typescript'
import { ts } from '../typescript.js'

type TypeScriptExpression = tsTypes.Expression
type TypeScriptArrayLiteralExpression = tsTypes.ArrayLiteralExpression
type TypeScriptObjectLiteralExpression = tsTypes.ObjectLiteralExpression

export type LiteralExpressionValue =
  | undefined
  | null
  | boolean
  | number
  | string
  | Record<string, any>
  | LiteralExpressionValue[]

const EMPTY_LITERAL_EXPRESSION_VALUE = Symbol('EMPTY_LITERAL_EXPRESSION_VALUE')

/** Recursively resolves an expression into a literal value. */
export function resolveLiteralExpression(
  expression: TypeScriptExpression,
  checker: tsTypes.TypeChecker,
  seen: Set<tsTypes.Node> = new Set()
): LiteralExpressionValue | LiteralExpressionValue[] | Symbol {
  expression = stripParentheses(expression)

  if (seen.has(expression)) {
    return EMPTY_LITERAL_EXPRESSION_VALUE
  }
  seen.add(expression)

  try {
    if (isNullLiteral(expression)) {
      return null
    }

    if (expression.kind === ts.SyntaxKind.FalseKeyword) {
      return false
    }

    if (expression.kind === ts.SyntaxKind.TrueKeyword) {
      return true
    }

    if (ts.isNumericLiteral(expression)) {
      return Number(expression.text)
    }

    if (
      ts.isStringLiteral(expression) ||
      expression.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral
    ) {
      return (expression as tsTypes.StringLiteralLike).text
    }

    if (ts.isIdentifier(expression)) {
      if (expression.text === 'undefined') {
        return undefined
      }

      const symbol = checker.getSymbolAtLocation(expression)
      if (!symbol) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const declarationSymbol = getDeclarationSymbol(symbol, checker)
      if (!declarationSymbol) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const declarations = declarationSymbol.getDeclarations() ?? []
      for (const declaration of declarations) {
        const resolved = resolveDeclarationInitializer(
          declaration,
          checker,
          seen
        )
        if (resolved !== EMPTY_LITERAL_EXPRESSION_VALUE) {
          return resolved
        }
      }
    }

    if (ts.isPropertyAccessExpression(expression)) {
      const target = resolveLiteralExpression(
        expression.expression,
        checker,
        seen
      )
      if (!isLiteralExpressionValue(target)) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      if (target && typeof target === 'object' && !Array.isArray(target)) {
        const name = expression.name.text
        return (target as Record<string, unknown>)[
          name
        ] as LiteralExpressionValue
      }

      return EMPTY_LITERAL_EXPRESSION_VALUE
    }

    if (ts.isElementAccessExpression(expression)) {
      const target = resolveLiteralExpression(
        expression.expression,
        checker,
        seen
      )
      if (!isLiteralExpressionValue(target)) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const argument = expression.argumentExpression
      if (!argument) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const index = resolveLiteralExpression(argument, checker, seen)
      if (!isLiteralExpressionValue(index)) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      if (Array.isArray(target) && typeof index === 'number') {
        return target[index]
      }

      if (target && typeof target === 'object') {
        const key = String(index)
        return (target as Record<string, unknown>)[
          key
        ] as LiteralExpressionValue
      }

      return EMPTY_LITERAL_EXPRESSION_VALUE
    }

    if (ts.isArrayLiteralExpression(expression)) {
      return resolveArrayLiteralExpression(expression, checker, seen)
    }

    if (ts.isObjectLiteralExpression(expression)) {
      return resolveObjectLiteralExpression(expression, checker, seen)
    }

    if (ts.isConditionalExpression(expression)) {
      const condition = resolveLiteralExpression(
        expression.condition,
        checker,
        seen
      )
      if (!isLiteralExpressionValue(condition)) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      if (condition) {
        return resolveLiteralExpression(expression.whenTrue, checker, seen)
      }

      return resolveLiteralExpression(expression.whenFalse, checker, seen)
    }

    if (ts.isBinaryExpression(expression)) {
      const operator = expression.operatorToken.kind

      if (operator === ts.SyntaxKind.AmpersandAmpersandToken) {
        const left = resolveLiteralExpression(expression.left, checker, seen)
        if (!isLiteralExpressionValue(left)) {
          return EMPTY_LITERAL_EXPRESSION_VALUE
        }

        if (!left) {
          return left
        }

        return resolveLiteralExpression(expression.right, checker, seen)
      }

      if (operator === ts.SyntaxKind.BarBarToken) {
        const left = resolveLiteralExpression(expression.left, checker, seen)
        if (!isLiteralExpressionValue(left)) {
          return EMPTY_LITERAL_EXPRESSION_VALUE
        }

        if (left) {
          return left
        }

        return resolveLiteralExpression(expression.right, checker, seen)
      }

      if (operator === ts.SyntaxKind.QuestionQuestionToken) {
        const left = resolveLiteralExpression(expression.left, checker, seen)
        if (!isLiteralExpressionValue(left)) {
          return EMPTY_LITERAL_EXPRESSION_VALUE
        }

        if (left !== null && left !== undefined) {
          return left
        }

        return resolveLiteralExpression(expression.right, checker, seen)
      }
    }

    if (ts.isSpreadElement(expression) || ts.isAsExpression(expression)) {
      return resolveLiteralExpression(expression.expression, checker, seen)
    }

    if (ts.isParenthesizedExpression(expression)) {
      return resolveLiteralExpression(expression.expression, checker, seen)
    }

    if (ts.isNonNullExpression(expression)) {
      return resolveLiteralExpression(expression.expression, checker, seen)
    }

    return EMPTY_LITERAL_EXPRESSION_VALUE
  } finally {
    seen.delete(expression)
  }
}

/** Resolves an array literal expression to an array. */
export function resolveArrayLiteralExpression(
  expression: TypeScriptArrayLiteralExpression,
  checker: tsTypes.TypeChecker,
  seen?: Set<tsTypes.Node>
): LiteralExpressionValue[] {
  return expression.elements.map((element) =>
    resolveLiteralExpression(element, checker, seen)
  )
}

/** Resolves an object literal expression to a plain object. */
export function resolveObjectLiteralExpression(
  expression: TypeScriptObjectLiteralExpression,
  checker: tsTypes.TypeChecker,
  seen?: Set<tsTypes.Node>
) {
  const object: Record<string, any> = {}

  for (const property of expression.properties) {
    if (ts.isPropertyAssignment(property)) {
      const name = getPropertyAssignmentName(property.name, checker, seen)
      if (!name) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const initializer = property.initializer
      const resolved = resolveLiteralExpression(initializer, checker, seen)
      if (resolved === EMPTY_LITERAL_EXPRESSION_VALUE) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      object[name] = resolved
      continue
    }

    if (ts.isShorthandPropertyAssignment(property)) {
      const name = property.name.text
      const symbol = checker.getShorthandAssignmentValueSymbol(property)
      if (!symbol) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const declarationSymbol = getDeclarationSymbol(symbol, checker)
      if (!declarationSymbol) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      const declarations = declarationSymbol.getDeclarations() ?? []
      let resolvedValue:
        | LiteralExpressionValue
        | LiteralExpressionValue[]
        | Symbol = EMPTY_LITERAL_EXPRESSION_VALUE

      for (const declaration of declarations) {
        resolvedValue = resolveDeclarationInitializer(
          declaration,
          checker,
          seen
        )

        if (resolvedValue !== EMPTY_LITERAL_EXPRESSION_VALUE) {
          break
        }
      }

      if (resolvedValue === EMPTY_LITERAL_EXPRESSION_VALUE) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      object[name] = resolvedValue
      continue
    }

    if (ts.isSpreadAssignment(property)) {
      const spreadExpression = property.expression
      const resolved = resolveLiteralExpression(spreadExpression, checker, seen)
      if (!isLiteralExpressionValue(resolved)) {
        return EMPTY_LITERAL_EXPRESSION_VALUE
      }

      Object.assign(object, resolved)
      continue
    }
  }

  return object
}

/** Determines when a value was resolved in `resolveLiteralExpression`. */
export function isLiteralExpressionValue(
  value: ReturnType<typeof resolveLiteralExpression>
): value is LiteralExpressionValue | LiteralExpressionValue[] {
  return value !== EMPTY_LITERAL_EXPRESSION_VALUE
}

function getDeclarationSymbol(
  symbol: tsTypes.Symbol,
  checker: tsTypes.TypeChecker
): tsTypes.Symbol | undefined {
  if (symbol.flags & ts.SymbolFlags.Alias) {
    try {
      return checker.getAliasedSymbol(symbol)
    } catch {
      return undefined
    }
  }

  return symbol
}

function resolveDeclarationInitializer(
  declaration: tsTypes.Declaration,
  checker: tsTypes.TypeChecker,
  seen?: Set<tsTypes.Node>
): LiteralExpressionValue | LiteralExpressionValue[] | Symbol {
  if (seen?.has(declaration)) {
    return EMPTY_LITERAL_EXPRESSION_VALUE
  }

  seen?.add(declaration)

  try {
    if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
      return resolveLiteralExpression(declaration.initializer, checker, seen)
    }

    if (ts.isBindingElement(declaration)) {
      if (declaration.initializer) {
        return resolveLiteralExpression(declaration.initializer, checker, seen)
      }

      const parent = declaration.parent
      if (ts.isObjectBindingPattern(parent)) {
        const name = declaration.propertyName ?? declaration.name
        if (ts.isIdentifier(name)) {
          const symbol = checker.getSymbolAtLocation(name)
          if (symbol) {
            const declarationSymbol = getDeclarationSymbol(symbol, checker)
            const declarations = declarationSymbol?.getDeclarations() ?? []
            for (const childDeclaration of declarations) {
              const resolved = resolveDeclarationInitializer(
                childDeclaration,
                checker,
                seen
              )

              if (resolved !== EMPTY_LITERAL_EXPRESSION_VALUE) {
                return resolved
              }
            }
          }
        }
      }
    }

    if (ts.isPropertyAssignment(declaration)) {
      return resolveLiteralExpression(declaration.initializer, checker, seen)
    }

    return EMPTY_LITERAL_EXPRESSION_VALUE
  } finally {
    seen?.delete(declaration)
  }
}

function getPropertyAssignmentName(
  name: tsTypes.PropertyName,
  checker: tsTypes.TypeChecker,
  seen?: Set<tsTypes.Node>
): string | undefined {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text
  }

  if (ts.isComputedPropertyName(name)) {
    const resolved = resolveLiteralExpression(name.expression, checker, seen)
    if (typeof resolved === 'string' || typeof resolved === 'number') {
      return resolved.toString()
    }
  }

  return undefined
}

function stripParentheses(expression: tsTypes.Expression): tsTypes.Expression {
  while (ts.isParenthesizedExpression(expression)) {
    expression = expression.expression
  }

  return expression
}

function isNullLiteral(node: tsTypes.Node): node is tsTypes.NullLiteral {
  return node.kind === ts.SyntaxKind.NullKeyword
}
