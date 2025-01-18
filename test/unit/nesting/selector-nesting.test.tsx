import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

const Basic = styled('div', {
  color: 'red',
  '&': {
    color: 'blue',
  },
})
createUnitTest({
  name: 'nesting & selectors',
  test: (
    <Basic>
      <Basic></Basic>
      <div></div>
    </Basic>
  ),
  expect: (
    <div className="a">
      <div className="a" />
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & {
        color: blue;
      }
    }
  `,
})

const Combined = styled('div', {
  color: 'red',
  '& &': {
    color: 'blue',
  },
})
createUnitTest({
  name: 'nesting & selectors with &',
  fails: true,
  test: (
    <Combined>
      <Combined></Combined>
      <div></div>
    </Combined>
  ),
  expect: (
    <div className="a">
      <div className="a" />
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & & {
        color: blue;
      }
    }
  `,
})

const Weird = styled('div', {
  color: 'red',
  '&&': {
    color: 'blue',
  },
})
createUnitTest({
  name: 'nesting & selectors with & (no space)',
  fails: true,
  test: (
    <Weird>
      <Weird></Weird>
      <div></div>
    </Weird>
  ),
  expect: (
    <div className="a">
      <div className="a" />
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      && {
        color: blue;
      }
    }
  `,
})
