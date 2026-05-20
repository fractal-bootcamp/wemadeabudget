import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import Loading from './loading'
import EntryGate from '@/lib/EntryGate'

// Local-only root layout. The Clerk-backed original is preserved at
// src/legacy/layout.tsx. Auth gating is replaced by EntryGate, which shows a
// splash with an "Enter" button on first visit (and never again on the same
// browser).

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WMAB',
  description: 'An App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EntryGate>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </EntryGate>
      </body>
    </html>
  )
}
