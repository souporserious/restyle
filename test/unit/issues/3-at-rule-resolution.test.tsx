import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const Box = styled('div')

createUnitTest({
  name: 'at-rule resolution is correct',
  test: (
    <>
      <Box
        css={{
          backgroundColor: 'red',
          '@media (min-width: 600px)': {
            backgroundColor: 'blue',
          },
        }}
      >
        Box 1
      </Box>
      <Box
        css={{
          backgroundColor: 'blue',
          '@media (min-width: 600px)': {
            backgroundColor: 'red',
          },
        }}
      >
        Box 1
      </Box>
    </>
  ),
  expect: (
    <>
      <div className="a">Box 1</div>
      <div className="b">Box 1</div>
    </>
  ),
  css: (css) => css`
    .a {
      background-color: red;
      @media (min-width: 600px) {
        background-color: blue;
      }
    }
    .b {
      background-color: blue;
      @media (min-width: 600px) {
        background-color: red;
      }
    }
  `,
})

// TODO: this test isn't really part of this issue, but was noted as part of the discussion
// it's more closely related to issue 30 imo, probably deserves its own issue
createUnitTest({
  name: 'media query order is deterministic',
  fails: true,
  test: (
    <>
      <Box
        css={{
          backgroundColor: 'red',
          '@media (min-width: 420px)': {
            backgroundColor: 'blue',
          },
          '@media (min-width: 600px)': {
            backgroundColor: 'green',
          },
        }}
      >
        all good here - last query applies
      </Box>
      <Box
        css={{
          backgroundColor: 'yellow',
          '@media (min-width: 600px)': {
            backgroundColor: 'gray',
          },
          '@media (min-width: 420px)': {
            backgroundColor: 'purple',
          },
        }}
      >
        also all good here - last query applies
      </Box>
      <Box
        css={{
          backgroundColor: 'red',
          '@media (min-width: 600px)': {
            backgroundColor: 'green',
          },
          '@media (min-width: 420px)': {
            backgroundColor: 'blue',
          },
        }}
      >
        uh oh - middle query applies due to reused classes
      </Box>
    </>
  ),
  expect: (
    <>
      <div className="a">This works</div>
      <div className="b">This doesn't work</div>
    </>
  ),
  css: (css) => css`
    .a {
      background-color: red;
      @media (min-width: 420px) {
        background-color: blue;
      }
      @media (min-width: 600px) {
        background-color: green;
      }
    }
    .b {
      background-color: red;
      @media (min-width: 600px) {
        background-color: green;
      }
      @media (min-width: 420px) {
        background-color: blue;
      }
    }
  `,
})
