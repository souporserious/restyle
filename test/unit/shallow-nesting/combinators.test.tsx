/**
 * CSS Combinators
 * @see https://www.w3schools.com/cssref/css_ref_combinators.php
 *
 * TODO test namespace separators?
 */

import { styled } from '../../../src/styled.js'
import { createNestingTest } from '../../createNestingTest.js'

const Box = styled('div')

createNestingTest({
  name: 'child combinator',
  css: {
    backgroundColor: 'red',

    '> p': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <p />
      <div>
        <p />
      </div>
    </>
  ),
})

createNestingTest({
  name: 'descendant combinator',
  css: {
    backgroundColor: 'red',

    p: {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <p />
      <div>
        <p />
      </div>
    </>
  ),
})

createNestingTest({
  name: 'next-sibling combinator',
  css: {
    backgroundColor: 'red',

    '+ p': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <>
      <This>
        <p />
        <p />
        <This>
          <p />
          <p />
        </This>
        <p />
        <p />
      </This>
      <p />
      <p />
    </>
  ),
})

createNestingTest({
  name: 'subsequent-sibling combinator',
  css: {
    backgroundColor: 'red',

    '~ p': {
      backgroundColor: 'blue',
    },
  },
  children: (This) => (
    <>
      <This>
        <This />
        <p />
        <p />
      </This>
      <This />
      <p />
      <p />
    </>
  ),
})

createNestingTest({
  name: 'selector list combinator',
  css: {
    '.a, .b': {
      backgroundColor: 'red',
    },
  },
  children: (
    <>
      <div className="a" />
      <div className="b" />
      <div className="c" />
    </>
  ),
})
