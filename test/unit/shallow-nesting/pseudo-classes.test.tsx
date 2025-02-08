/**
 * CSS Pseudo-classes
 * @see https://www.w3schools.com/cssref/css_ref_pseudo_classes.php
 *
 * note that because there are a lot of these and they're all very similar, I'm not going to test them all
 * I'll just test a subset of them that should cover all the syntaxes
 *
 * :disabled
 * :any-link
 * :lang()
 * :nth-child()
 * :where()
 */

import { createNestingTest } from '../../createNestingTest.js'

createNestingTest({
  name: ':disabled pseudo-class',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':disabled': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <input type="text" disabled />
      <input type="text" />
    </>
  ),
})

createNestingTest({
  name: ':any-link pseudo-class',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':any-link': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <a href="#" />
      <a />
    </>
  ),
})

createNestingTest({
  name: ':lang() pseudo-class',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':lang(en)': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <p lang="en" />
      <p lang="it" />
    </>
  ),
})

createNestingTest({
  name: ':nth-child() pseudo-class',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',
    ':nth-child(2)': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <p />
      <p />
      <p />
    </>
  ),
})

createNestingTest({
  name: ':where() pseudo-class',
  fails: { asPassed: true },
  css: {
    backgroundColor: 'red',

    ':where(div, p)': {
      backgroundColor: 'blue',
    },
  },
  children: (
    <>
      <div />
      <p />
      <div />
      <a />
    </>
  ),
})
