import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { styled } from '../src/styled.js'
import { expectMatchingStyles } from './expectMatchingStyles.js'
import { page } from '@vitest/browser/context'

describe('composition', () => {
  it('overrides classes in the simplest case', () => {
    // we'll render just our colors first to establish their priority
    const Red = styled('div', {
      color: 'red',
    })
    const Green = styled('div', {
      color: 'green',
    })

    const Test = styled(Red, {
      color: 'green',
    })

    const screen = render(
      <div>
        <Red />
        <Green />
        <Test />
      </div>
    )

    expectMatchingStyles(
      screen,
      <div>
        <div id="red"></div>
        <div id="green"></div>
        <div id="test"></div>
      </div>,
      (css) => css`
        #red {
          color: red;
        }
        #green {
          color: green;
        }
        #test {
          color: green;
        }
      `
    )
  })

  it('overrides classes in a longer chain', () => {
    const Red = styled('div', {
      color: 'red',
    })
    const Green = styled('div', {
      color: 'green',
    })
    const Blue = styled('div', {
      color: 'blue',
    })

    const FirstChain = styled(Red, {
      color: 'green',
    })
    const SecondChain = styled(FirstChain, {
      color: 'blue',
    })

    const screen = render(
      <div>
        <Red />
        <Green />
        <Blue />
        <FirstChain />
        <SecondChain />
      </div>
    )

    expectMatchingStyles(
      screen,
      <div>
        <div id="r"></div>
        <div id="g"></div>
        <div id="b"></div>
        <div id="first"></div>
        <div id="second"></div>
      </div>,
      (css) => css`
        #r {
          color: red;
        }
        #g {
          color: green;
        }
        #b {
          color: blue;
        }
        #first {
          color: green;
        }
        #second {
          color: blue;
        }
      `
    )
  })

  it('overrides classes when nested', async () => {
    const A = styled('div', {
      color: 'red',
      '@media (width < 1000px)': {
        color: 'blue',
      },
    })
    const B = styled(A, {
      color: 'green',
    })

    const screen = render(
      <div>
        <A />
        <B />
      </div>
    )

    // both should be blue when viewport is <= 1000px
    expectMatchingStyles(
      screen,
      <div>
        <div id="a"></div>
        <div id="b"></div>
      </div>,
      (css) => css`
        #a,
        #b {
          color: blue;
        }
      `
    )

    await page.viewport(1000, 1000)
    expectMatchingStyles(
      screen,
      <div>
        <div id="a"></div>
        <div id="b"></div>
      </div>,
      (css) => css`
        #a {
          color: red;
        }
        #b {
          color: green;
        }
      `
    )
  })

  it('overrides classes when nested deeply', () => {
    const A = styled('div', {
      color: 'red',
      '@media (width <= 1000px)': {
        color: 'orange',
        '&:first-child': {
          color: 'blue',
        },
      },
    })

    const B = styled(A, {
      color: 'green',
    })

    // first child should be blue when viewport is <= 1000px
    // second child should be orange when viewport is <= 1000px
    expectMatchingStyles(
      render(
        <div>
          <B />
          <B />
          <A />
        </div>
      ),
      <div>
        <div id="b"></div>
        <div id="b"></div>
        <div id="a"></div>
      </div>,
      (css) => css`
        #a {
          color: red;
          @media (width <= 1000px) {
            color: orange;
            &:first-child {
              color: blue;
            }
          }
        }
        #b {
          color: green;
          @media (width <= 1000px) {
            color: orange;
            &:first-child {
              color: blue;
            }
          }
        }
      `
    )
  })

  it('overrides classes through a component in the middle', () => {
    const A = styled('div', {
      color: 'red',
    })

    const SomeComponent = ({ className }: { className?: string }) => (
      <A className={className} />
    )

    const B = styled(SomeComponent, {
      color: 'green',
    })

    // B should always be green, regardless of order
    expectMatchingStyles(
      render(
        <div>
          <A />
          <B />
        </div>
      ),
      <div>
        <div id="a"></div>
        <div id="b"></div>
      </div>,
      (css) => css`
        #a {
          color: red;
        }
        #b {
          color: green;
        }
      `
    )

    expectMatchingStyles(
      render(
        <div>
          <B />
          <A />
        </div>
      ),
      <div>
        <div id="b"></div>
        <div id="a"></div>
      </div>,
      (css) => css`
        #a {
          color: red;
        }
        #b {
          color: green;
        }
      `
    )
  })

  it('respects the css prop', () => {
    const A = styled('div', {
      color: 'red',
    })

    const B = styled(A, {
      color: 'green',
    })

    // css prop is always highest priority
    expectMatchingStyles(
      render(
        <div>
          <B />
          <A />
          <B css={{ color: 'blue' }} />
          <A css={{ color: 'blue' }} />
        </div>
      ),
      <div>
        <div id="b"></div>
        <div id="a"></div>
        <div className="blue"></div>
        <div className="blue"></div>
      </div>,
      (css) => css`
        #a {
          color: red;
        }
        #b {
          color: green;
        }
        .blue {
          color: blue;
        }
      `
    )
  })
})
