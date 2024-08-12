import EditCategoryModal from './EditCategoryModal'
import useBudgetStore from '../../stores/transactionStore'
import { formatCentsToDollarString } from '../../util/utils'
import { useState, useCallback, useRef } from 'react'

interface BudgetTableRowProps {
  name: string
  selected: boolean
  editing: boolean
  toggleEdit: () => void
  toggleSelect: () => void
}
export default function BudgetTableRow({
  name,

  selected,
  editing,
  toggleEdit,
  toggleSelect,
}: BudgetTableRowProps) {
  const { categories, getBalanceByCategory } = useBudgetStore()
  const allocated = categories.find((c) => c.name === name)?.allocated || 0
  const activityCents = getBalanceByCategory(name)
  const availableCents = allocated + activityCents
  const [editAllocatedInput, setEditAllocatedInput] = useState((allocated / 100).toFixed(2))

  const inputRef = useRef<HTMLInputElement>(null)


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newValue = parseFloat(editAllocatedInput)
      if (!isNaN(newValue)) {
        // updateCategoryAllocation(name, Math.round(newValue * 100))
        //replace with real setter function
        console.log("allocation updated")
        inputRef.current?.blur()
      }
    }
  }, [editAllocatedInput, name])
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
                  toggleEdit()
                  console.log('deleting not yet implemented')
                }}
              />
            )}
          </span>
        </div>
      </div>
      <div className="flex w-[15%] justify-end">
        <input
          ref={inputRef}
          type="number"
          className={`w-full truncate px-2 text-right rounded ${selected ? 'border border-indigo-500 cursor-text' : 'hover:border hover:border-indigo-500 hover:cursor-text'}`}
          value={editAllocatedInput}
          onChange={(e) => {
            setEditAllocatedInput(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditAllocatedInput((allocated / 100).toFixed(2))}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="flex w-[15%] justify-end">
        <div className="truncate px-2 py-0.5">
          {activityCents >= 0
            ? `$${(activityCents / 100).toFixed(2)}`
            : `-$${(-activityCents / 100).toFixed(2)}`}
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
