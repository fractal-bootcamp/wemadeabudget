'use client'

import { on } from 'events'
import { useState } from 'react'
interface ClearedButtonProps {
  onToggle: () => void
  cleared: boolean
}
export default function ClearedButton({
  onToggle,
  cleared,
}: ClearedButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex h-2 w-2 items-center justify-center rounded-full border border-gray-400 font-bold ${cleared ? 'bg-green-400' : 'bg-white'} p-2 text-center text-xs text-gray-600`}
    >
      C
      <input type="hidden" name="cleared" value="false" />
    </button>
  )
}
