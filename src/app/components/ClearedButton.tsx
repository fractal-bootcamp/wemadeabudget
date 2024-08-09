'use client'

import { useState } from 'react'

export default function ClearedButton() {
  const [cleared, setCleared] = useState(false)
  return (
    <button
      onClick={() => setCleared(!cleared)}
      className={`flex h-2 w-2 items-center justify-center rounded-full border border-gray-400 font-bold ${cleared ? 'bg-green-400' : 'bg-white'} p-2 text-center text-xs text-gray-600`}
    >
      C
      <input type="hidden" name="cleared" value="false" />
    </button>
  )
}
