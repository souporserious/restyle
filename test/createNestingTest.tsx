import { describe } from 'vitest'
import { createSyntaxTest, type SyntaxTestOptions } from './createSyntaxTest.js'

/**
 * a convenience wrapper around createSyntaxTest
 * specifically for testing nesting behaviors with the & selector
 */
export const createNestingTest = ({
  name,
  fails,
  ...props
}: SyntaxTestOptions & {
  /**
   * for newly tested behaviors
   * specify if this test is expected to fail
   */
  fails?: {
    asPassed?: boolean
    withAmpersandNoSpace?: boolean
    withAmpersandWithSpace?: boolean
  }
}) => {
  describe(name, () => {
    if (props.css.color) {
      throw new Error(
        'color is inheritable, which may cause false positives. use backgroundColor instead'
      )
    }

    createSyntaxTest({ ...props, name: 'as passed', fails: fails?.asPassed })
    createSyntaxTest({
      ...props,
      name: 'with & with space',
      rulePrefix: '& ',
      fails: fails?.withAmpersandWithSpace,
    })
    createSyntaxTest({
      ...props,
      name: 'with & no space',
      rulePrefix: '&',
      fails: fails?.withAmpersandNoSpace,
    })
  })
}
