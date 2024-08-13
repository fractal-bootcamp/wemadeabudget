import { Flag } from '@prisma/client'
import { FlagDetails, typeDetailsArray } from '../../types'
import { Bookmark, Check } from 'lucide-react'

const lighterHexCodes: { [key: string]: string } = {
  '#FF0000': '#FF6666', // Red
  '#00FF00': '#66FF66', // Green
  '#0000FF': '#6666FF', // Blue
  '#FFFF00': '#FFFF66', // Yellow
  '#00FFFF': '#66FFFF', // Cyan
  '#FF00FF': '#FF66FF', // Magenta
  '#000000': '#666666', // Black
  '#FFFFFF': '#FFFFFF', // White (unchanged)
  '#808080': '#B3B3B3', // Gray
}

interface FlagEditModalProps {
  currentFlag: Flag
  onFlagSelect: (flag: Flag) => void
}
export default function FlagEditModal({
  currentFlag,
  onFlagSelect,
}: FlagEditModalProps) {
  return (
    <div
      className="top-fullflex absolute left-1/2 z-50 w-[125px] -translate-x-1/2 translate-y-4 flex-col items-center gap-2 rounded-md border bg-white p-3 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      style={{ overflow: 'visible' }}
    >
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-l border-t border-gray-200 bg-white" />
      {typeDetailsArray(FlagDetails).map((flagOption) => (
        <button
          onClick={() => onFlagSelect(flagOption.type)}
          className="flex w-20 gap-1 rounded-full border border-slate-300 px-3 py-1 text-[10px] font-light text-gray-400"
          key={flagOption.display}
          style={{
            backgroundColor:
              currentFlag === flagOption.type
                ? lighterHexCodes[flagOption.hexCode]
                : '',
          }}
        >
          {currentFlag === flagOption.type ? (
            <Check className="h-4 w-4 text-slate-700" />
          ) : (
            <Bookmark
              className="rotate-[270deg] transform text-gray-400"
              size={16}
              fill={flagOption.hexCode}
              color={
                flagOption.hexCode === '#ffffff' ? 'gray' : flagOption.hexCode
              }
            />
          )}
          {flagOption.display}
        </button>
      ))}
    </div>
  )
}
