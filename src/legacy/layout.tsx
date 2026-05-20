// LEGACY — original root layout. Wrapped the app in ClerkProvider and
// gated everything behind SignedIn/SignedOut. Lives outside src/app/ so Next
// App Router never compiles it into the build (every .tsx under src/app/ gets
// bundled, even from _-prefixed folders).

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import SignUpOrIn from './sign-up-page'
import { Suspense } from 'react'
import Loading from '@/app/loading'

const inter = Inter({ subsets: ['latin'] })
export const dynamic = 'force-dynamic'
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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedOut>
            <SignUpOrIn />
          </SignedOut>
          <SignedIn>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
