import React from 'react'

import type { CustomProperties } from './types'
import { createStyles, hash } from './utils'

export type KeyframeSteps = 'from' | 'to' | `${number}%`

export type KeyframesObject = {
  [stage in KeyframeSteps]?: React.CSSProperties & CustomProperties
}

/** Generates styles from an object of keyframes and injects them globally. */
export function keyframes(steps: KeyframesObject, nonce?: string) {
  const keyframesString = createStyles(steps)
  const keyframesName = `k${hash(keyframesString)}`
  const keyframesCSS = `@keyframes ${keyframesName} { ${keyframesString} }`

  function KeyframesComponent() {
    return (
      <style
        // @ts-expect-error
        href={keyframesName}
        precedence="rsk"
        nonce={nonce}
      >
        {keyframesCSS}
      </style>
    )
  }

  KeyframesComponent.toString = () => keyframesName

  return KeyframesComponent
}
