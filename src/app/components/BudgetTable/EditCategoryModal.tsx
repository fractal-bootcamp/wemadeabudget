import { useRef, useState } from 'react'
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
interface EditCategoryModalProps {
  originalName: string
  categories: CategoryDetails[]
  onSave: (name: string) => void
  closeModal: () => void
  onDelete: () => void
}
export default function EditCategoryModal({
  originalName,
  categories,
  onSave,
  closeModal,
  onDelete,
}: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState(originalName)
  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })
  return (
    <div
      className="shadow-top absolute top-full z-50 flex -translate-x-1/4 translate-y-4 flex-col gap-2 rounded-md border bg-white p-3 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
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
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button onClick={onDelete} className="mybtn mybtn-del">
            Delete
          </button>
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="mybtn mybtn-secondary">
              {' '}
              Cancel{' '}
            </button>
            <button
              onClick={() => {
                const { valid, message } = checkSubmit(categoryName, categories)
                if (valid) {
                  onSave(categoryName)
                  closeModal()
                } else {
                  setSubmitStatus({ valid, message })
                }
              }}
              className="mybtn mybtn-primary"
            >
              {' '}
              OK{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
