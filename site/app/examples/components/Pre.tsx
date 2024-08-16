'use client'
import React, { createContext, useState } from 'react'

export const PreActiveContext = createContext<boolean | null>(null)

export function Pre({
  children,
  className,
  ...props
}: React.ComponentProps<'pre'>) {
  const [active, setActive] = useState(false)
  const handleFocus = () => setActive(true)
  const handleBlur = (event: React.FocusEvent<HTMLPreElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return
    }
    setActive(false)
  }
  const handlePointerEnter = () => setActive(true)
  const handlePointerLeave = () => setActive(false)

  return (
    <pre
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={className}
      css={{
        position: 'relative',
        whiteSpace: 'pre-wrap',
        padding: '1rem',
        backgroundColor: 'rgba(0,0,0,0.05)',
        overflowX: 'auto',
      }}
      {...props}
    >
      <PreActiveContext.Provider value={active}>
        {children}
      </PreActiveContext.Provider>
    </pre>
  )
}
