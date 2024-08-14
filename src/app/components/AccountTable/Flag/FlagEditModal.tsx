import { Flag } from '@prisma/client'
import { FlagDetails, typeDetailsArray } from '../../../types'
import { Bookmark, Check } from 'lucide-react'

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
      className="absolute left-1/2 top-full z-50 flex -translate-x-1/2 translate-y-4 flex-col items-center gap-2 rounded-md border bg-white p-3 px-5 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
      style={{ overflow: 'visible' }}
    >
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-l border-t border-gray-200 bg-white" />

      {typeDetailsArray(FlagDetails).map((flagOption) => (
        <button
          onClick={() => onFlagSelect(flagOption.type)}
          className="flex w-32 items-center gap-1 rounded-full border px-3 text-sm font-light text-gray-800 transition-all duration-200 hover:bg-slate-200"
          key={flagOption.display}
          style={{
            borderColor: currentFlag === flagOption.type ? '' : '#d0d0d0',
            backgroundColor:
              currentFlag === flagOption.type ? flagOption.lighterHexCode : '',
          }}
        >
          {currentFlag === flagOption.type ? (
            <Check className="h-4 w-4 shrink-0 text-slate-700" />
          ) : (
            <Bookmark
              className="shrink-0 rotate-[270deg] transform text-gray-400"
              size={16}
              fill={flagOption.hexCode}
              color={
                flagOption.hexCode === '#ffffff' ? 'gray' : flagOption.hexCode
              }
            />
          )}
          <span className="flex items-center justify-start truncate">
            {flagOption.display}
          </span>
        </button>
      ))}
    </div>
  )
}
