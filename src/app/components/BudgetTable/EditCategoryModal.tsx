import { useRef, useState } from 'react'
import { CategoryDetails } from '../../types'
import {
  checkSubmittedName,
  METHODS,
  submitStatus,
  updateStoreAndDb,
} from '../../util/utils'
import { dbCategoryUpdate } from '../../actions/controller'
import useBudgetStore from '../../stores/transactionStore'

interface EditCategoryModalProps {
  originalName: string
  categories: CategoryDetails[]
  closeModal: () => void
  onDelete: () => void
}
export default function EditCategoryModal({
  originalName,
  categories,
  closeModal,
  onDelete,
}: EditCategoryModalProps) {
  const { updateCategory } = useBudgetStore()
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
            setSubmitStatus({ valid: true, message: '' })
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
                const { valid, message } = checkSubmittedName(
                  categoryName,
                  categories.map((c) => c.name)
                )
                if (!valid) {
                  setSubmitStatus({ valid, message })
                  return
                }
                const newDetails: CategoryDetails = {
                  name: categoryName,
                  allocated: 0,
                }
                updateStoreAndDb({
                  dbFunction: dbCategoryUpdate,
                  storeFunction: updateCategory,
                  payload: { oldName: originalName, newDetails },
                  method: METHODS.UPDATE,
                })
                closeModal()
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
