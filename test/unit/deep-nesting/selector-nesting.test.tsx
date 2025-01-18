import { styled } from '../../../src/styled.js'
import { createUnitTest } from '../../createUnitTest.js'

const css = String.raw

const Basic = styled('div', {
  color: 'red',
  '&': {
    color: 'blue',
    '&': {
      color: 'green',
    },
  },
})
createUnitTest({
  name: 'deeply nesting & selectors',
  fails: true,
  test: (
    <Basic>
      <Basic>
        <Basic></Basic>
        <div />
      </Basic>
      <div></div>
    </Basic>
  ),
  expect: (
    <div className="a">
      <div className="a">
        <div className="a" />
        <div />
      </div>
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & {
        color: blue;
        & {
          color: green;
        }
      }
    }
  `,
})

const Combined = styled('div', {
  color: 'red',
  '& &': {
    color: 'blue',
    '& &': {
      color: 'green',
    },
  },
})

createUnitTest({
  name: 'deeply nesting & selectors with &',
  fails: true,
  test: (
    <Combined>
      <Combined>
        <Combined>
          <Combined>
            <Combined></Combined>
            <div />
          </Combined>
          <div></div>
        </Combined>
        <div></div>
      </Combined>
      <div></div>
    </Combined>
  ),
  expect: (
    <div className="a">
      <div className="a">
        <div className="a">
          <div className="a">
            <div className="a" />
            <div />
          </div>
          <div />
        </div>
        <div className="a" />
      </div>
      <div className="a" />
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      & & {
        color: blue;
        & & {
          color: green;
        }
      }
    }
  `,
})

const Weird = styled('div', {
  color: 'red',
  '&&': {
    color: 'blue',
    '&&': {
      color: 'green',
    },
  },
})
createUnitTest({
  name: 'deeply nesting & selectors with & (no space)',
  fails: true,
  test: (
    <Weird>
      <Weird>
        <Weird>
          <Weird>
            <Weird></Weird>
            <div />
          </Weird>
          <div></div>
        </Weird>
        <div></div>
      </Weird>
      <div></div>
    </Weird>
  ),
  expect: (
    <div className="a">
      <div className="a">
        <div className="a">
          <div className="a">
            <div className="a" />
            <div />
          </div>
          <div />
        </div>
        <div className="a" />
      </div>
      <div className="a" />
      <div />
    </div>
  ),
  css: css`
    .a {
      color: red;
      && {
        color: blue;
        && {
          color: green;
        }
      }
    }
  `,
})
