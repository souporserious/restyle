import { Suspense } from 'react'

import { SuspenseChildren } from './SuspenseChildren'
import { LazyChildren } from './LazyChildren'

export default function Page() {
  return (
    <div style={{ height: '100vh', background: 'black', color: 'white' }}>
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error - async JSX type error */}
        <SuspenseChildren>
          <h1 css={{ fontWeight: 'bold', color: 'orange' }}>
            Suspense Children
          </h1>
        </SuspenseChildren>
      </Suspense>

      <LazyChildren>
        <h1 css={{ fontWeight: 'bold', color: 'orange' }}>Lazy Children</h1>
      </LazyChildren>

      <h1 css={{ fontWeight: 'bold' }}>Immediate Children</h1>
    </div>
  )
}
