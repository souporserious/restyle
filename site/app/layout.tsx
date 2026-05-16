import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import { getSiteMetadata } from '../utils/get-site-metadata'

import './layout.css'

export function generateMetadata(): Metadata {
  const siteMetadata = getSiteMetadata()
  return siteMetadata
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
