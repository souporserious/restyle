type MediaFeatureValue = string | number | boolean

interface MediaQueryTypes {
  all?: boolean
  print?: boolean
  screen?: boolean
  speech?: boolean
}

type MediaFeatureQualifiers =
  | { not?: boolean; only?: never }
  | { only?: boolean; not?: never }
  | {}

interface MediaFeatures {
  // Width and Height
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  height?: string | number
  minHeight?: string | number
  maxHeight?: string | number

  // Device Width and Height
  deviceWidth?: string | number
  minDeviceWidth?: string | number
  maxDeviceWidth?: string | number
  deviceHeight?: string | number
  minDeviceHeight?: string | number
  maxDeviceHeight?: string | number

  // Aspect Ratio
  aspectRatio?: string
  minAspectRatio?: string
  maxAspectRatio?: string
  deviceAspectRatio?: string
  minDeviceAspectRatio?: string
  maxDeviceAspectRatio?: string

  // Color
  color?: true
  minColor?: number
  maxColor?: number
  colorIndex?: number
  colorGamut?: 'srgb' | 'p3' | 'rec2020'
  minColorIndex?: number
  maxColorIndex?: number

  // Monochrome
  monochrome?: number
  minMonochrome?: number
  maxMonochrome?: number

  // Resolution
  resolution?: string
  minResolution?: string
  maxResolution?: string

  // Overflow
  overflowBlock?: 'none' | 'scroll' | 'optional-paged' | 'paged'
  overflowInline?: 'none' | 'scroll'

  // Other Features
  orientation?: 'portrait' | 'landscape'
  scan?: 'interlace' | 'progressive'
  grid?: 0 | 1 | boolean
  update?: 'none' | 'slow' | 'fast'
  displayMode?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
  prefersColorScheme?: 'light' | 'dark' | 'no-preference'
  prefersContrast?: 'no-preference' | 'high' | 'low'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  prefersReducedTransparency?: 'no-preference' | 'reduce'
  pointer?: 'none' | 'coarse' | 'fine'
  hover?: 'none' | 'hover'
  anyPointer?: 'none' | 'coarse' | 'fine'
  anyHover?: 'none' | 'hover'
  lightLevel?: 'dim' | 'normal' | 'washed'
  scripting?: 'none' | 'initial-only' | 'enabled'
}

type MediaQueryObject = MediaQueryTypes & MediaFeatureQualifiers & MediaFeatures

type MediaQueryKey = keyof MediaQueryObject

export function camelToHyphen(str: string): string {
  return str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

function isDimension(feature: string): boolean {
  return /(height|width|resolution)$/.test(feature)
}

function processFeature(
  feature: MediaQueryKey,
  value: MediaFeatureValue
): string {
  feature = camelToHyphen(feature) as MediaQueryKey

  if (isDimension(feature) && typeof value === 'number') {
    value = `${value}px`
  }

  if (value === true) return feature

  if (value === false) return `not ${feature}`

  return `(${feature}: ${value})`
}

const mediaTypeKeys: (keyof MediaQueryTypes)[] = [
  'all',
  'print',
  'screen',
  'speech',
]

/** Create a media query string from a list of media query objects. */
export function media(...queries: (MediaQueryObject | string)[]) {
  const objectToMediaQuery = (query: MediaQueryObject): string => {
    let prefix: 'not ' | 'only ' | '' = ''

    // Handle 'not' and 'only' qualifiers
    if ('not' in query && query.not) {
      prefix = 'not '
    }
    if ('only' in query && query.only) {
      if (prefix! === 'not ') {
        throw new Error(
          'Cannot use both "not" and "only" qualifiers in the same media query'
        )
      }
      prefix = 'only '
    }

    // Handle media types
    const mediaTypes: string[] = []

    for (let index = 0; index < mediaTypeKeys.length; index++) {
      const type = mediaTypeKeys[index]

      if (type && query[type]) {
        mediaTypes.push(type)
      }
    }

    // Handle media features
    const features: string[] = []
    const featureKeys = Object.keys(query) as Array<keyof MediaQueryObject>

    for (let index = 0; index < featureKeys.length; index++) {
      const key = featureKeys[index] as MediaQueryKey | 'not' | 'only'

      if (
        key &&
        key !== 'not' &&
        key !== 'only' &&
        !mediaTypeKeys.includes(key as keyof MediaQueryTypes) &&
        query[key] !== undefined
      ) {
        const value = query[key]
        const processedFeature = processFeature(key, value as MediaFeatureValue)

        if (processedFeature) {
          features.push(processedFeature)
        }
      }
    }

    return prefix + mediaTypes.concat(features).join(' and ')
  }

  let result = ''

  for (let index = 0; index < queries.length; index++) {
    const query = queries[index]
    let mq = ''

    if (typeof query === 'string') {
      mq = query
    } else if (query) {
      mq = objectToMediaQuery(query)
    }
    if (mq) {
      if (result) result += ', '
      result += mq
    }
  }

  return '@media ' + result
}
