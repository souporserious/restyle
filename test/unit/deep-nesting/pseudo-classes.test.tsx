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
  fails: { asPassed: true, withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',
    ':disabled': {
      backgroundColor: 'blue',
      ':disabled': {
        backgroundColor: 'green',
      },
    },
  },
  children: (
    <>
      <input type="text" disabled />
      <input type="text" disabled />
      <optgroup disabled>
        <option value="1" disabled>
          1
        </option>
        <option value="2">2</option>
      </optgroup>
      <optgroup>
        <option value="1" disabled>
          1
        </option>
        <option value="2">2</option>
      </optgroup>
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
      ':any-link': {
        backgroundColor: 'green',
      },
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
  fails: { asPassed: true, withAmpersandWithSpace: true },
  css: {
    backgroundColor: 'red',
    ':lang(en)': {
      backgroundColor: 'blue',
      ':lang(it)': {
        backgroundColor: 'green',
      },
    },
  },
  children: (
    <>
      <p lang="en" />
      <p lang="it" />
      <div lang="en">
        <p lang="en" />
        <p lang="it" />
      </div>
      <div lang="it">
        <p lang="en" />
        <p lang="it" />
      </div>
    </>
  ),
})

createNestingTest({
  name: ':nth-child() pseudo-class',
  fails: { asPassed: true, withAmpersandNoSpace: true },
  css: {
    backgroundColor: 'red',
    ':nth-child(2)': {
      backgroundColor: 'blue',
      ':nth-child(2)': {
        backgroundColor: 'green',
      },
    },
  },
  children: (This) => (
    <>
      <This />
      <This />
      <This />
      <div />
      <div />
      <div>
        <div />
        <div />
        <div />
      </div>
    </>
  ),
})

createNestingTest({
  name: ':where() pseudo-class',
  fails: {
    asPassed: true,
    withAmpersandNoSpace: true,
    withAmpersandWithSpace: true,
  },
  css: {
    backgroundColor: 'red',

    ':where(div, p)': {
      backgroundColor: 'blue',

      ':where(div, p)': {
        backgroundColor: 'green',
      },
    },
  },
  children: (
    <>
      <div />
      <p />
      <a />
      <div>
        <div />
        <p />
        <a />
        <div>
          <div />
          <p />
          <a />
        </div>
      </div>
    </>
  ),
})
