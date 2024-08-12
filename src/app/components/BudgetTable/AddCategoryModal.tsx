import { useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import { CategoryDetails } from '../../types'
import {
  checkSubmittedName,
  submitStatus,
  updateStoreAndDb,
} from '../../util/utils'
import { dbCategoryAdd } from '../../actions/controller'

interface AddCategoryModalProps {
  toggleShowModal: () => void
}
export default function AddCategoryModal({
  toggleShowModal: closeFunction,
}: AddCategoryModalProps) {
  const { categories, addCategory } = useBudgetStore((store) => ({
    categories: store.categories,
    addCategory: store.addCategory,
  }))
  const [categoryName, setCategoryName] = useState('')

  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })

  return (
    <div className="shadow-top absolute top-full z-50 flex -translate-x-1/4 translate-y-4 flex-col gap-2 rounded-md border bg-white p-3 shadow-2xl">
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
        <button onClick={closeFunction} className="mybtn mybtn-secondary">
          Cancel
        </button>
        <button
          //   disabled={isDuplicate}
          onClick={() => {
            const { valid, message } = checkSubmittedName(
              categoryName,
              categories.map((category) => category.name)
            )
            if (valid) {
              const newCategory: CategoryDetails = {
                name: categoryName,
                allocated: 0,
                permanent: false,
              }
              updateStoreAndDb({
                dbFunction: dbCategoryAdd,
                storeFunction: addCategory,
                payload: newCategory,
                method: 'ADD',
              })
              closeFunction()
            } else {
              setSubmitStatus({ valid, message })
            }
          }}
          className="mybtn mybtn-primary"
        >
          OK
        </button>
      </div>
    </div>
  )
}
