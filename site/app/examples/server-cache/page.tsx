import { Suspense } from 'react'

import { SuspenseChildren } from './SuspenseChildren'
import { LazyChildren } from './LazyChildren'

export default function Page() {
  return (
    <div style={{ height: '100vh', background: 'black', color: 'white' }}>
      {/* <Suspense fallback="Loading...">
        <SuspenseChildren>
          <h1 css={{ fontSize: '1rem', fontWeight: 'bold' }}>Lazy Children</h1>
        </SuspenseChildren>
      </Suspense> */}
      <LazyChildren>
        <h1 css={{ fontSize: '2rem', fontWeight: 'bold' }}>Lazy Children</h1>
      </LazyChildren>
      <h1 css={{ fontWeight: 'bold' }}>Immediate Children</h1>
    </div>
  )
}
