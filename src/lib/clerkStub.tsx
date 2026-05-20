// Drop-in stubs for the @clerk/nextjs hooks/components still imported by
// Sidebar.tsx. The local-only build has no real users, so useUser returns a
// nullish profile (isLoaded: true so the "Your Budget" fallback fires) and
// UserButton renders nothing. The original Clerk integration is preserved in
// src/legacy/.

'use client'

import type { ReactNode } from 'react'

export interface StubUser {
  firstName: string | null
  username: string | null
  emailAddresses: { emailAddress: string }[]
}

// isLoaded is reported as false so Sidebar.tsx falls back to its "Your Budget"
// title instead of templating "undefined's Budget" from a null user.
export const useUser = (): { user: StubUser | null; isLoaded: boolean } => ({
  user: null,
  isLoaded: false,
})

interface UserButtonProps {
  appearance?: unknown
  children?: ReactNode
}

export const UserButton = (_props: UserButtonProps) => null
