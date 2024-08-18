import EditCategoryModal from './EditCategoryModal'
import useBudgetStore, { useBudgetActions } from '../../stores/transactionStore'
import {
  formatCentsToDollarString,
  METHODS,
  updateStoreAndDb,
} from '../../util/utils'
import { useState, useCallback, useRef } from 'react'
import { dbCategoryDelete, dbCategoryUpdate } from '../../actions/controller'
import { CategoryDetails, CategoryUpdatePayload } from '../../types'

interface BudgetTableRowProps {
  name: string
  selected: boolean
  editing: boolean
  toggleEdit: () => void
  toggleSelect: () => void
  onSelect: (name: string) => void
}
export default function BudgetTableRow({
  name,
  selected,
  editing,
  toggleEdit,
  toggleSelect,
  onSelect,
}: BudgetTableRowProps) {
  const [editAllocation, setEditAllocation] = useState(false)
  const { getBalanceByCategory, updateCategory, deleteCategory } =
    useBudgetActions()
  const categories = useBudgetStore((state) => state.categories)
  const allocated = categories.find((c) => c.name === name)?.allocated || 0
  const activityCents = getBalanceByCategory(name)
  const availableCents = allocated + activityCents
  const [editAllocatedInput, setEditAllocatedInput] = useState(allocated / 100)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onSelect(name)
  }
  const submitNewAllocation = () => {
    const newDetails: CategoryDetails = {
      name: name,
      allocated: Math.round(editAllocatedInput * 100),
      permanent: false,
    }
    updateStoreAndDb({
      dbFunction: dbCategoryUpdate,
      storeFunction: updateCategory,
      payload: { oldName: name, newDetails: newDetails },
      method: METHODS.UPDATE,
    })
  }
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && editAllocation) {
        submitNewAllocation()
        inputRef.current?.blur()
        setEditAllocation(false)
      }
    },
    [editAllocatedInput, name]
  )
  return (
    <div
      className={`flex items-stretch border-b border-gray-300 py-2 pr-4 ${selected ? 'bg-indigo-200' : 'bg-white'}`}
      onClick={toggleSelect}
    >
      <div className="flex w-[40px] items-center justify-center">
        <input
          type="checkbox"
          className="h-3 w-3"
          checked={selected}
          onClick={(e) => e.stopPropagation()} //prevents click from toggling twice by propogating to the divs onclick
          onChange={toggleSelect}
        />
      </div>
      <div className="relative flex w-[55%] items-center pl-3">
        {/* Category Name */}
        <div className="w-full truncate">
          <span
            className={`flex items-center ${selected ? 'cursor-pointer hover:underline' : ''}`}
            onClick={
              selected
                ? (e) => {
                    e.stopPropagation()
                    toggleEdit()
                  }
                : undefined
            }
          >
            {name}
            {/* Edit Category Modal */}
            {editing && (
              <EditCategoryModal
                originalName={name}
                categories={categories}
                closeModal={() => {
                  toggleEdit()
                }}
                onDelete={() => {
                  updateStoreAndDb({
                    dbFunction: dbCategoryDelete,
                    storeFunction: deleteCategory,
                    payload: name,
                    method: METHODS.DELETE,
                  })
                }}
              />
            )}
          </span>
        </div>
      </div>
      <div className="flex w-[15%] justify-end">
        {editAllocation ? (
          <input
            ref={inputRef}
            type="number"
            className={`w-full truncate rounded px-2 text-right hover:cursor-text hover:border hover:border-indigo-500`}
            value={editAllocatedInput}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100)
              setEditAllocatedInput(cents / 100)
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              submitNewAllocation()
              setEditAllocation(false)
            }}
            onClick={handleInputClick}
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <div
            className={`z-20 w-full truncate rounded px-2 text-right hover:cursor-text hover:border hover:border-indigo-500 hover:bg-white`}
            onClick={() => setEditAllocation(true)}
          >
            {formatCentsToDollarString(allocated)}
          </div>
        )}
      </div>
      <div className="flex w-[15%] justify-end">
        <div className="truncate px-2 py-0.5">
          {formatCentsToDollarString(activityCents)}
        </div>
      </div>
      <div className="flex w-[15%] justify-end">
        <div
          className={`truncate px-2 py-0.5 ${availableCents >= 0 ? 'rounded-full bg-green-300' : availableCents < 0 ? 'rounded-full bg-red-300' : ''}`}
        >
          {formatCentsToDollarString(availableCents)}
        </div>
      </div>
    </div>
  )
}
