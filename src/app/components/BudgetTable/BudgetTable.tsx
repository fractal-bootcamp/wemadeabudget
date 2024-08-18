import { useEffect, useRef, useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import BudgetHeader from './BudgetHeader'
import BudgetActionBar from './BudgetActionBar'
import BudgetTableRow from './BudgetTableRow'

export default function BudgetTable() {
  const categories = useBudgetStore((store) => store.categories)
  const sortedCategories = [...categories]
    .sort((a, b) =>
      a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
    )
    .filter((c) => c.name !== 'Ready to Assign')

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

  const handleRowInputSelect = (name: string) => {
    setSelectedCategories(new Set([name]))
  }

  return (
    <div className="flex w-full flex-col text-xs">
      {/* Model underly */}
      {(currentEditCategory !== '' || showAddCategoryModal) && (
        <div
          className="fixed inset-0 z-50 h-full w-full bg-transparent"
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

      {sortedCategories.map((category, index) => (
        <BudgetTableRow
          key={category.name}
          name={category.name}
          editing={currentEditCategory === category.name}
          toggleEdit={() =>
            setCurrentEditCategory(
              currentEditCategory === category.name ? '' : category.name
            )
          }
          selected={selectedCategories.has(category.name)}
          toggleSelect={categorySelectionToggle(category.name)}
          onSelect={handleRowInputSelect}
        />
      ))}
    </div>
  )
}
