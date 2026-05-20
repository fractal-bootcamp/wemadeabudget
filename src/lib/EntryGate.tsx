'use client'

import { useEffect, useState } from 'react'
import useBudgetStore from '@/app/stores/transactionStore'
import Splash from '@/app/components/Splash'

const ENTERED_KEY = 'wmab-entered'

// Gates the budget UI behind a splash/Enter button instead of Clerk auth.
// Also pulls the persisted store out of localStorage on mount (the persist
// middleware is configured with skipHydration: true so SSR markup matches the
// first client paint).
export default function EntryGate({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    useBudgetStore.persist.rehydrate()
    setEntered(
      typeof window !== 'undefined' &&
        localStorage.getItem(ENTERED_KEY) === 'true'
    )
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!entered) {
    return (
      <Splash
        onEnter={() => {
          localStorage.setItem(ENTERED_KEY, 'true')
          setEntered(true)
        }}
      />
    )
  }

  return <>{children}</>
}
