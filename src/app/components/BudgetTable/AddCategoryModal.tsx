import { useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import { CategoryDetails } from '../../types'

interface AddCategoryModalProps {
  onCancel: () => void
  onSave: (
    name: string,
    storeSetter: (details: CategoryDetails) => void
  ) => void
}
export default function AddCategoryModal({
  onCancel,
  onSave,
}: AddCategoryModalProps) {
  const { categories, addCategory } = useBudgetStore((store) => ({
    categories: store.categories,
    addCategory: store.addCategory,
  }))
  const [categoryName, setCategoryName] = useState('')
  const isDuplicate = categories.some(
    (category) => category.name === categoryName
  )
  const [showError, setShowError] = useState(false)
  return (
    <div className="shadow-top absolute top-full flex -translate-x-1/4 translate-y-4 flex-col gap-2 rounded-md border bg-white p-3 shadow-2xl">
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-transparent border-b-white bg-white shadow-2xl" />
      <div
        className={`border ${showError ? `border-red-300` : `border-gray-200`} rounded p-2`}
      >
        <input
          type="text"
          placeholder="New Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      {showError && (
        <div className="rounded-md bg-red-300 p-2 text-black">
          The category name is required.
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="btn-secondary">
          {' '}
          Cancel{' '}
        </button>
        <button
          disabled={isDuplicate}
          onClick={() => {
            onSave(categoryName, addCategory)
            onCancel()
          }}
          className="btn-primary"
        >
          {' '}
          OK{' '}
        </button>
      </div>
    </div>
  )
}
