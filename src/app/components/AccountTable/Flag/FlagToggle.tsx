import React, { useState } from 'react'
import { Bookmark, Check } from 'lucide-react'
import { Flag, FlagDetails } from '../../../types'
import FlagEditModal from './FlagEditModal'

interface FlagToggleProps {
  currentFlag: Flag
  onFlagSelect: (flag: Flag) => void
}

export default function FlagToggle({
  currentFlag,
  onFlagSelect,
}: FlagToggleProps) {
  const [showFlagModal, setShowFlagModal] = useState(false)

  const handleToggleModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowFlagModal((prev) => !prev)
  }
  const closeModal = () => setShowFlagModal(false)
  return (
    <>
      {showFlagModal && (
        <div
          className="absolute inset-0 z-40 h-full w-full bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            closeModal()
          }}
        />
      )}
      <div className="relative" onClick={handleToggleModal}>
        <Bookmark
          className="rotate-[270deg] transform text-gray-400"
          id="form-flag"
          size={16}
          fill={
            FlagDetails[currentFlag].hexCode === '#ffffff'
              ? 'transparent'
              : FlagDetails[currentFlag].hexCode
          }
          color={
            FlagDetails[currentFlag].hexCode === '#ffffff'
              ? 'gray'
              : FlagDetails[currentFlag].hexCode
          }
        />
        {showFlagModal && (
          <FlagEditModal
            currentFlag={currentFlag}
            onFlagSelect={(flag) => {
              onFlagSelect(flag)
              closeModal()
            }}
          />
        )}
      </div>
    </>
  )
}
