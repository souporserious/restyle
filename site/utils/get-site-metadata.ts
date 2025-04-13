import type { Metadata } from 'next'

const url = 'https://restyle.dev/'

export function getSiteMetadata({
  title = 'Restyle - Zero Config CSS for React',
  description = `The easiest way to add CSS styles to your React components.`,
  keywords = 'react, css, css-in-js, styling, styled, components, design, systems',
  ...rest
}: { title?: string; description?: string } & Omit<
  Metadata,
  'title' | 'description'
> = {}) {
  return {
    metadataBase: new URL(url),
    title,
    description,
    keywords,
    ...rest,
    twitter: {
      card: 'summary_large_image',
      site: '@souporserious',
      ...rest.twitter,
    },
  } satisfies Metadata
}
