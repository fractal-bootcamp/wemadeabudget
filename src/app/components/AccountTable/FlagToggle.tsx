'use client'
import { Bookmark } from 'lucide-react'
import { Flag, FlagDetails, typeDetailsArray } from '../../types'

interface FlogTaggleProps {
  flag: Flag
  // setFlag: (flag: Flag) => void
  onToggle: () => void
}
export default function FlogTaggle({
  onToggle,
  flag,
  // setFlag,
}: FlogTaggleProps) {
  const flagDetails = FlagDetails[flag]
  const flagDetailsArray = typeDetailsArray(FlagDetails)
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
