import { GlobalStyles } from 'restyle'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <Link href="/examples">Examples</Link>
      <GlobalStyles>
        {{
          h1: {
            fontFamily: 'comic sans ms',
          },
        }}
      </GlobalStyles>
      <h1>Hello World</h1>
    </>
  )
}
