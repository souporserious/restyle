'use client'
import { useState } from 'react'

export function LazyChildren({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false)

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle Children</button>
      {show ? children : null}
    </>
  )
}
