'use client'
import { Bookmark } from 'lucide-react'
import { Flag, flagColors } from '../../types'
import { useMemo } from 'react'

interface FlogTaggleProps {
  flag: Flag
  onToggle: () => void
}
export default function FlogTaggle({ onToggle, flag }: FlogTaggleProps) {
  return (
    <div onClick={onToggle}>
      <Bookmark
        className="rotate-[270deg] transform text-gray-400"
        id="form-flag"
        size={16}
        fill={flagColors[flag]}
      />
      <input type="hidden" name="flag" value={flag} />
    </div>
  )
}
