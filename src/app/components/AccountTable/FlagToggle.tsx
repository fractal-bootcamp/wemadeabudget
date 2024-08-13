import React, { useState } from 'react'
import { Bookmark, Check } from 'lucide-react'
import {
  Flag,
  FlagDetails,
  TransactionDetails,
  typeDetailsArray,
} from '../../types'
import FlagEditModal from './FlagEditModal'
import { METHODS, updateStoreAndDb } from '../../util/utils'
import { dbTransactionUpdate } from '../../actions/controller'
import useBudgetStore from '../../stores/transactionStore'

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

  return (
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
        <FlagEditModal currentFlag={currentFlag} onFlagSelect={onFlagSelect} />
      )}
    </div>
  )
}
