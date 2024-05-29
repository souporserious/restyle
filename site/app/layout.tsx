import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import { getSiteMetadata } from '../utils/get-site-metadata'

import './layout.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  )
}
