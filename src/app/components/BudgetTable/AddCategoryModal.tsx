import { useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import { CategoryDetails } from '../../types'

interface submitStatus {
  valid: boolean
  message: string
}
const checkSubmit = (
  name: string,
  existing: CategoryDetails[]
): submitStatus => {
  if (name.length === 0) {
    return { valid: false, message: 'Name is required' }
  }
  if (name.trim().length === 0) {
    return { valid: false, message: 'Name cannot be only spaces' }
  }
  if (existing.some((category) => category.name === name)) {
    return { valid: false, message: 'Category already exists' }
  }
  return { valid: true, message: '' }
}

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
  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })

  return (
    <div className="shadow-top absolute top-full flex -translate-x-1/4 translate-y-4 flex-col gap-2 rounded-md border bg-white p-3 shadow-2xl">
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-transparent border-b-white bg-white shadow-2xl" />

      <div>
        <input
          type="text"
          placeholder="New Category Name"
          value={categoryName}
          className={`border ${!submitStatus.valid ? `rounded-t border-red-300` : `rounded border-gray-200`} p-2`}
          onChange={(e) => {
            setCategoryName(e.target.value)
            setSubmitStatus({ ...submitStatus, valid: true, message: '' })
          }}
        />
        {!submitStatus.valid && (
          <div className="bg-red-300 p-2 text-black">
            {submitStatus.message}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="btn-secondary">
          {' '}
          Cancel{' '}
        </button>
        <button
          disabled={isDuplicate}
          onClick={() => {
            const { valid, message } = checkSubmit(categoryName, categories)
            if (valid) {
              onSave(categoryName, addCategory)
              onCancel()
            } else {
              setSubmitStatus({ valid, message })
            }
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
