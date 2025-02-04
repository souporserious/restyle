/**
 * CSS Combinators
 * @see https://www.w3schools.com/cssref/css_ref_combinators.php
 *
 * TODO test namespace separators
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: 'deeply nested child combinator',
  fails: { withAmpersandWithSpace: true, withAmpersandNoSpace: true },
  css: {
    backgroundColor: 'red',

    '> div': {
      '> p': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </>
  ),
})

createNestingTest({
  name: 'deeply nested descendant combinator',
  fails: { withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',

    div: {
      p: {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div>
        <p />
      </div>
      <div>
        <div>
          <p />
        </div>
      </div>
    </>
  ),
})

createNestingTest({
  name: 'deeply nested next-sibling combinator',
  fails: { withAmpersandWithSpace: true, withAmpersandNoSpace: true },

  css: {
    backgroundColor: 'red',

    '+ div': {
      '+ p': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div />
      <p />
      <div>
        <p />
        <p />
      </div>
      <p />
    </>
  ),
})

createNestingTest({
  name: 'deeply nested subsequent-sibling combinator',
  fails: { withAmpersandWithSpace: true, withAmpersandNoSpace: true },
  css: {
    backgroundColor: 'red',

    '~ div': {
      '~ p': {
        backgroundColor: 'blue',
      },
    },
  },
  children: (
    <>
      <div />
      <p />
      <p />
      <div>
        <p />
        <p />
      </div>
      <p />
    </>
  ),
})

createNestingTest({
  name: 'deeply nested selector list combinator',
  fails: {
    asPassed: true,
    withAmpersandWithSpace: true,
    withAmpersandNoSpace: true,
  },
  css: {
    '.a, .b': {
      backgroundColor: 'red',
      '.a, .b': {
        backgroundColor: 'green',
      },
    },
  },
  children: (
    <>
      <div className="a">
        <div className="b">
          <div className="a"></div>
          <p />
        </div>
      </div>
      <div className="b">
        <div className="a">
          <div className="b"></div>
        </div>
        <p />
      </div>
      <div className="c">
        <p />
      </div>
      <p></p>
    </>
  ),
})
