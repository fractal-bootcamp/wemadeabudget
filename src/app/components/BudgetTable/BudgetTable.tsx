import { useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import BudgetHeader from './BudgetHeader'
import BudgetActionBar from './BudgetActionBar'
import { CategoryDetails } from '../../types'
import { categoryAdd } from '../../actions/controller'
import AddCategoryModal from './AddCategoryModal'

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
const updateExistingCategory = async (
  details: CategoryDetails,
  storeUpdater: (details: CategoryDetails) => void
) => {
  //update existing category in store
  storeUpdater(details)
  //update existing category in database
  const updatedCategory = await categoryAdd(details)
  console.log(`Category updated: ${updatedCategory.name}`)
}
export default function BudgetTable() {
  const {
    categories,
    addCategory,
    removeCategory,
    editCategory,
    getTransactionsByCategory,
  } = useBudgetStore((store) => ({
    categories: store.categories,
    addCategory: store.addCategory,
    removeCategory: store.removeCategory,
    editCategory: store.editCategory,
    getTransactionsByCategory: store.getTransactionsByCategory,
  }))
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  /**Returns total of all transactions for a given category in cents */
  const categoryActivity = (categoryName: string) => {
    const transactions = getTransactionsByCategory(categoryName)
    const totalCents = transactions.reduce(
      (acc, transaction) => acc + transaction.cents,
      0
    )
    return totalCents
  }
  const toggleCategory = (category: string) => () => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  return (
    <div className="flex w-full flex-col text-xs">
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
          <input type="checkbox" className="h-3 w-3" />
        </div>
        <div className="flex w-[55%] p-2">CATEGORY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ASSIGNED</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ACTIVITY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">AVAILABLE</div>
      </div>

      {categories.map((category, index) => {
        const activityCents = categoryActivity(category.name)
        const availableCents = category.allocated - activityCents
        return (
          <div
            key={index}
            className="flex items-stretch border-b border-gray-300 py-2 pr-4"
          >
            <div className="flex w-[40px] items-center justify-center">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={selectedCategories.has(category.name)}
                onChange={toggleCategory(category.name)}
              />
            </div>
            <div className="w-[55%] truncate"> {category.name} </div>
            <div className="w-[15%] truncate text-right">
              {' '}
              {category.allocated >= 0
                ? `$${(category.allocated / 100).toFixed(2)}`
                : `-$${(-category.allocated / 100).toFixed(2)}`}{' '}
            </div>
            <div className="w-[15%] truncate text-right">
              {' '}
              {activityCents >= 0
                ? `$${(activityCents / 100).toFixed(2)}`
                : `-$${(-activityCents / 100).toFixed(2)}`}{' '}
            </div>
            <div className="w-[15%] truncate text-right">
              {' '}
              {availableCents >= 0
                ? `$${(availableCents / 100).toFixed(2)}`
                : `-$${(-availableCents / 100).toFixed(2)}`}{' '}
            </div>
          </div>
        )
      })}
    </div>
  )
}
