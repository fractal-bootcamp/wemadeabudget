import { useEffect, useRef, useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import BudgetHeader from './BudgetHeader'
import BudgetActionBar from './BudgetActionBar'
import { CategoryDetails } from '../../types'
import {
  categoryAdd,
  categoryDelete,
  categoryUpdate,
} from '../../actions/controller'
import AddCategoryModal from './AddCategoryModal'
import BudgetTableRow from './BudgetTableRow'
//TODO: add handling for duplicates etc
const saveNewCategory = async (
  name: string,
  storeSetter: (details: CategoryDetails) => void
) => {
  //add new category to store
  storeSetter({ name, allocated: 0 })
  //add new category to database
  const newCategory = await categoryAdd({ name, allocated: 0 })
  console.log(`New category added: ${newCategory}`)
}
// TODO: decide if we want thi defined here or in the modal as it is now
// const updateExistingCategory = async (
//   oldName: string,
//   newDetails: CategoryDetails,
//   storeUpdater: (oldName: string, newDetails: CategoryDetails) => void
// ) => {
//   //update existing category in store
//   storeUpdater(oldName, newDetails)
//   //update existing category in database
//   const updatedCategory = await categoryUpdate(oldName, newDetails)
//   console.log(`Category updated: ${updatedCategory.name}`)
// }
const deleteCategory = async (
  categoryName: string,
  storeDeleter: (categoryName: string) => void
) => {
  //delete category from store
  storeDeleter(categoryName)
  //delete category from database
  const deletedCategory = await categoryDelete(categoryName)
  console.log(`Category deleted: ${deletedCategory.name}`)
}
export default function BudgetTable() {
  const {
    categories,
    addCategory,
    removeCategory,
    editCategory,
    getTransactionsByCategory,
  } = useBudgetStore((store) => ({
    categories: store.categories.reverse(),
    addCategory: store.addCategory,
    removeCategory: store.deleteCategory,
    editCategory: store.editCategory,
    getTransactionsByCategory: store.getTransactionsByCategory,
  }))
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [currentEditCategory, setCurrentEditCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const selectAllRef = useRef<HTMLInputElement>(null)
  //we control the master checkbox with a ref bc we need to use indeterminate
  useEffect(() => {
    if (!selectAllRef.current) return
    //set to checked if all are now selected
    selectAllRef.current.checked = selectedCategories.size === categories.length
    //set to indeterminate if any but not all are selected
    selectAllRef.current.indeterminate =
      selectedCategories.size > 0 && selectedCategories.size < categories.length
  }, [selectedCategories])
  /**Returns total of all transactions for a given category in cents */
  const categoryActivity = (categoryName: string) => {
    const transactions = getTransactionsByCategory(categoryName)
    const totalCents = transactions.reduce(
      (acc, transaction) => acc + transaction.cents,
      0
    )
    return totalCents
  }
  const categorySelectionToggle = (category: string) => () => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev)
      newSet.has(category) ? newSet.delete(category) : newSet.add(category)
      return newSet
    })
  }
  const toggleSelectAll = () => {
    const anySelected = selectedCategories.size > 0
    setSelectedCategories(
      anySelected ? new Set() : new Set(categories.map((c) => c.name))
    )
  }

  return (
    <div className="flex w-full flex-col text-xs">
      {/* Model underly */}
      {(currentEditCategory !== '' || showAddCategoryModal) && (
        <div
          className="bg=transparent fixed inset-0 z-50 h-full w-full"
          onClick={(e) => {
            e.stopPropagation()
            setCurrentEditCategory('')
            setShowAddCategoryModal(false)
          }}
        />
      )}
      <BudgetHeader />
      <div className="relative">
        <BudgetActionBar
          showModal={showAddCategoryModal}
          toggleShowModal={() => setShowAddCategoryModal(!showAddCategoryModal)}
          onSave={saveNewCategory}
        />
      </div>
      <div className="flex items-stretch border-b border-l border-t border-gray-300 text-gray-500">
        <div className="flex w-[40px] items-center justify-center border-r border-gray-300 p-2">
          <input
            type="checkbox"
            ref={selectAllRef}
            className="h-3 w-3"
            onChange={toggleSelectAll}
          />
        </div>
        <div className="flex w-[55%] p-2">CATEGORY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ASSIGNED</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ACTIVITY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">AVAILABLE</div>
      </div>

      {categories.map((category, index) => (
        <BudgetTableRow
          key={category.name}
          name={category.name}
          allocated={category.allocated}
          editing={currentEditCategory === category.name}
          toggleEdit={() =>
            setCurrentEditCategory(
              currentEditCategory === category.name ? '' : category.name
            )
          }
          selected={selectedCategories.has(category.name)}
          toggleSelect={categorySelectionToggle(category.name)}
          activityCents={categoryActivity(category.name)}
        />
      ))}
    </div>
  )
}
