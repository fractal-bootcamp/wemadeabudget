import { useState } from 'react'
import EditCategoryModal from './EditCategoryModal'
import { CategoryDetails } from '../../types'
import { categoryDelete, categoryUpdate } from '../../actions/controller'
import useBudgetStore from '../../stores/transactionStore'

const confirmEditCategoryOnClick = async (
  oldName: string,
  newDetails: CategoryDetails,
  storeSetter: (oldName: string, newDetails: CategoryDetails) => void
) => {
  //add to store
  storeSetter(oldName, newDetails)
  //add to database
  const result = await categoryUpdate(oldName, newDetails)
  console.log(result)
}
const deleteCategoryOnClick = async (
  name: string,
  storeDeleter: (name: string) => void
) => {
  //add to store
  storeDeleter(name)
  //add to database
  const result = await categoryDelete(name)
  console.log(result)
}
interface BudgetTableRowProps {
  name: string
  allocated: number
  selected: boolean
  editing: boolean
  toggleEdit: () => void
  toggleSelect: () => void
  activityCents: number
}
export default function BudgetTableRow({
  name,
  allocated,
  selected,
  activityCents,
  editing,
  toggleEdit,
  toggleSelect,
}: BudgetTableRowProps) {
  const { categories, editCategory, deleteCategory } = useBudgetStore(
    (store) => ({
      categories: store.categories,
      editCategory: store.editCategory,
      deleteCategory: store.deleteCategory,
    })
  )
  const availableCents = allocated - activityCents
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
                onSave={(newName) => {
                  toggleSelect()
                  confirmEditCategoryOnClick(
                    name,
                    { name: newName, allocated: allocated },
                    editCategory
                  )
                }}
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
        <div className="truncate px-2 py-0.5">
          {allocated >= 0
            ? `$${(allocated / 100).toFixed(2)}`
            : `-$${(-allocated / 100).toFixed(2)}`}
        </div>
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
          {availableCents >= 0
            ? `$${(availableCents / 100).toFixed(2)}`
            : `-$${(-availableCents / 100).toFixed(2)}`}
        </div>
      </div>
    </div>
  )
}
