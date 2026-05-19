import * as React from 'react'

import { analyzeCssProps } from './analyze-css-props/index.js'
import type { AnalyzeCssPropsOptions } from './analyze-css-props/index.js'
import type { CssPropCacheEntry } from './css-cache.js'
import { ensureGlobalCssCache, setGlobalCssCache } from './css-cache.js'
import type { CSSRule, CSSRulePrecedences } from './types.js'

export interface HeadStylesProps extends AnalyzeCssPropsOptions {
  cache?: Record<string, CssPropCacheEntry>
  nonce?: string
}

type DepthBuckets = Map<
  number,
  {
    low: CSSRule[]
    medium: CSSRule[]
    high: CSSRule[]
  }
>

/**
 * Runs the css prop analyzer during server rendering and streams the cached
 * styles to the document head.
 */
export function HeadStyles({
  cache: providedCache,
  nonce,
  ...options
}: HeadStylesProps) {
  const cache = providedCache ?? analyzeCssProps(options).cache
  const globalCache = ensureGlobalCssCache()
  globalCache.entries = { ...globalCache.entries, ...cache }
  globalCache.nonce = nonce
  setGlobalCssCache(globalCache)

  const buckets = collectDepthBuckets(globalCache.entries)
  const depths = Array.from(buckets.keys()).sort((a, b) => a - b)

  return (
    <>
      {depths.flatMap((depth) => {
        const bucket = buckets.get(depth)!
        const depthString = depth === 0 ? '' : depth.toString()
        const precedence = {
          low: `rsl${depthString}`,
          medium: `rsm${depthString}`,
          high: `rsh${depthString}`,
        }
        const sharedProps = nonce ? { nonce } : {}

        return [
          renderStyleBucket(bucket.low, precedence.low, 'l', sharedProps),
          renderStyleBucket(bucket.medium, precedence.medium, 'm', sharedProps),
          renderStyleBucket(bucket.high, precedence.high, 'h', sharedProps),
        ]
      })}
    </>
  )
}

function renderStyleBucket(
  rules: CSSRule[],
  precedence: string,
  keySuffix: string,
  sharedProps: { nonce?: string }
) {
  if (rules.length === 0) {
    return (
      <style
        href={`${precedence}i`}
        precedence={precedence}
        key={`${precedence}-initial`}
        {...sharedProps}
      />
    )
  }

  return rules.map(([className, rule]) => (
    <style
      href={className}
      precedence={precedence}
      key={`${className}-${keySuffix}`}
      {...sharedProps}
    >
      {rule}
    </style>
  ))
}

function collectDepthBuckets(
  cache: Record<string, CssPropCacheEntry>
): DepthBuckets {
  const buckets: DepthBuckets = new Map()
  const seen = new Set<string>()

  for (const entry of Object.values(cache)) {
    mergeRules(entry.rules, 0, seen, buckets)
  }

  return buckets
}

function mergeRules(
  rules: CSSRulePrecedences,
  depth: number,
  seen: Set<string>,
  buckets: DepthBuckets
) {
  const [low, medium, high, nested] = rules

  if (!buckets.has(depth)) {
    buckets.set(depth, { low: [], medium: [], high: [] })
  }

  const bucket = buckets.get(depth)!

  for (const rule of low) {
    if (!seen.has(rule[0])) {
      seen.add(rule[0])
      bucket.low.push(rule)
    }
  }

  for (const rule of medium) {
    if (!seen.has(rule[0])) {
      seen.add(rule[0])
      bucket.medium.push(rule)
    }
  }

  for (const rule of high) {
    if (!seen.has(rule[0])) {
      seen.add(rule[0])
      bucket.high.push(rule)
    }
  }

  for (const child of nested) {
    mergeRules(child, depth + 1, seen, buckets)
  }
}
