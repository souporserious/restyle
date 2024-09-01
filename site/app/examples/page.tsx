import { css, styled, type CSSObject } from 'restyle'

import { ClientComponent } from './ClientComponent'
import Link from 'next/link'

type GridProps = {
  gridTemplateColumns: string
}

const Grid = styled('div', (props: GridProps) => ({
  display: 'grid',
  gridTemplateColumns: props.gridTemplateColumns,
}))

export default async function Page() {
  const { CodeBlockExamples } = await import('./code-block/CodeBlockExamples')

  return (
    <>
      <h2>Prop function styles</h2>
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Grid>

      <h2>Overriding css prop styles</h2>
      <OverridingCssPropStyles />

      <h2>Precedence</h2>
      <PrecedenceExample />

      <h2>Client Component</h2>
      <ClientComponent />

      <h2>Mixed Server and Client Components</h2>
      <CodeBlockExamples />
      <Link href="/examples/code-block">Code Block</Link>

      <h2>Void Elements</h2>
      <input
        css={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '0.25rem',
        }}
      />
    </>
  )
}

function Button({
  children,
  css: cssProp,
}: {
  children: React.ReactNode
  css?: CSSObject
}) {
  const [classNames, Styles] = css({
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: 'dodgerblue',
    color: 'white',
    ':hover': {
      backgroundColor: 'royalblue',
    },
    ...cssProp,
  })
  return (
    <>
      <button className={classNames}>{children}</button>
      <Styles />
    </>
  )
}

/** The order of rules matters and the last key/value wins. */
function OverridingCssPropStyles() {
  return (
    <Button
      css={{
        backgroundColor: 'tomato',
        ':hover': {
          backgroundColor: 'red',
        },
      }}
    >
      Click me
    </Button>
  )
}

// Don't do this
// function OverridingCssStyles() {
//   const [classNames, Styles] = css({ backgroundColor: 'tomato' })
//   return (
//     <>
//       <Button className={classNames}>Click me</Button>
//       <Styles />
//     </>
//   )
// }

/**
 * Order of the values themeselves does not matter since these are based on precedence from
 * low, medium, and high. The following example will have a red border and a larger blue left border.
 */
const PrecedenceExample = styled('div', {
  height: '1rem',
  borderLeftWidth: '3px',
  borderLeft: '2px solid blue',
  border: '1px solid red',
})
