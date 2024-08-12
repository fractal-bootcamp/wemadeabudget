'use client'
import { Bookmark } from 'lucide-react'
import { Flag, FlagDetails } from '../../types'

interface FlogTaggleProps {
  flag: Flag
  onToggle: () => void
}
export default function FlogTaggle({ onToggle, flag }: FlogTaggleProps) {
  const flagDetails = FlagDetails[flag]
  return (
    <div onClick={onToggle}>
      <Bookmark
        className="rotate-[270deg] transform text-gray-400"
        id="form-flag"
        size={16}
        fill={flagDetails.hexCode}
      />
      <input type="hidden" name="flag" value={flag} />
    </div>
  )
}
