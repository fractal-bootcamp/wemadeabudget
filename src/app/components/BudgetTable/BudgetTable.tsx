import { useState } from 'react'
import { PlusCircle, LucideUndo, LucideRedo } from 'lucide-react'

const defaultCategories = [
  { name: 'Restaurants', assigned: 0, activity: 0, available: 0 },
  { name: 'Rent', assigned: 1200000, activity: -20000, available: 0 }, // 1200.00
  { name: 'Utilities', assigned: 300000, activity: -5000, available: 0 }, // 300.00
  {
    name: 'Renters Insurance',
    assigned: 150000,
    activity: 0,
    available: -10000,
  }, // 150.00
  { name: 'Phone', assigned: 60000, activity: 0, available: -2000 }, // 60.00
  { name: 'Internet', assigned: 70000, activity: 0, available: 0 }, // 70.00
  { name: 'Music', assigned: 12000, activity: -3000, available: 0 }, // 12.00
  { name: 'Groceries', assigned: 400000, activity: 0, available: -5000 }, // 400.00
  { name: 'Train/Bus Fare', assigned: 50000, activity: 0, available: 0 }, // 50.00
  { name: 'Personal Care', assigned: 80000, activity: -1000, available: 0 }, // 80.00
  {
    name: 'Stuff I Forgot to Budget For',
    assigned: 100000,
    activity: 0,
    available: 0,
  }, // 100.00
  { name: 'Celebrations', assigned: 200000, activity: 0, available: -15000 }, // 200.00
]

const BudgetHeader = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(1) // Add state for selected month

  return (
    //TODO make this actually change the view based on the month
    <div className="mx-4 my-2 flex flex-col justify-center">
      <div className="ml-4 font-sans text-xl font-semibold">
        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        })}
      </div>
      <div className="flex">
        <select
          id="monthSelector"
          className="rounded border p-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, index) => {
            const month = new Date(0, index).toLocaleString('default', {
              month: 'long',
            })
            return (
              <option key={index} value={index + 1}>
                {month}
              </option>
            )
          })}
        </select>
        <select
          id="yearSelector"
          className="rounded border p-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => {
            const year = new Date().getFullYear() - index
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

const AddCategoryModal = ({
  onCancel,
  saveCategory,
}: {
  onCancel: () => void
  saveCategory: (name: string) => void
}) => {
  const [name, setName] = useState('')
  const [showError, setShowError] = useState(false)

  const handleSave = () => {
    if (name.length === 0) {
      setShowError(true)
      return
    } else {
      setShowError(false)
      saveCategory(name)
    }
  }

  return (
    <div className="shadow-top absolute mt-1 -translate-x-10 translate-y-8 rounded-md border bg-white p-3 shadow-2xl">
      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-transparent border-b-white bg-white shadow-2xl" />
      <div
        className={`border ${showError ? `border-red-300` : `border-gray-200`} rounded p-2`}
      >
        <input
          type="text"
          placeholder="New Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {showError && (
        <div className="rounded-md bg-red-300 p-2 text-black">
          The category name is required.
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onCancel}
          className="rounded-lg bg-indigo-100 px-4 py-2 text-blue-600 hover:bg-indigo-200"
        >
          {' '}
          Cancel{' '}
        </button>
        <button
          onClick={handleSave}
          className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
        >
          {' '}
          OK{' '}
        </button>
      </div>
    </div>
  )
}

function ActionBar({
  addingCategory,
  addCategory,
  onCancel,
  saveCategory,
}: {
  addingCategory: boolean
  addCategory: () => void
  onCancel: () => void
  saveCategory: (name: string) => void
}) {
  return (
    <>
      <div className="relative flex flex-row gap-4 border-b border-l border-t border-gray-300 p-2 text-indigo-600">
        <button onClick={addCategory} className="flex gap-1 text-xs">
          <PlusCircle className="h-4 w-4" /> Category{' '}
        </button>
        <button className="flex gap-1 text-xs">
          <LucideUndo className="h-4 w-4" /> Undo{' '}
        </button>
        <button className="flex gap-1 text-xs">
          <LucideRedo className="h-4 w-4" /> Redo{' '}
        </button>
      </div>
      {addingCategory && (
        <AddCategoryModal onCancel={onCancel} saveCategory={saveCategory} />
      )}
    </>
  )
}

function BudgetTable() {
  const [categories, setCategories] = useState(defaultCategories)
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [addingCategory, setAddingCategory] = useState(false)

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

  function saveCategory(name: string) {
    setAddingCategory(false)
    setCategories((prev) => [
      ...prev,
      { name, assigned: 0, activity: 0, available: 0 },
    ])
  }

  return (
    <div className="flex w-full flex-col text-xs">
      <BudgetHeader />
      <ActionBar
        addingCategory={addingCategory}
        onCancel={() => setAddingCategory(false)}
        addCategory={() => setAddingCategory(true)}
        saveCategory={saveCategory}
      />
      <div className="flex flex-row items-stretch border-b border-l border-t border-gray-300 text-gray-500">
        <div className="flex w-[40px] items-center justify-center border-r border-gray-300 p-2">
          <div className="h-[10px] w-[10px] rounded-sm border border-gray-500"></div>
        </div>
        <div className="flex w-[55%] p-2">CATEGORY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ASSIGNED</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">ACTIVITY</div>
        <div className="flex w-[15%] justify-end p-2 pr-3">AVAILABLE</div>
      </div>

      {categories.map((category, index) => (
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
            {category.assigned >= 0
              ? `$${(category.assigned / 100).toFixed(2)}`
              : `-$${(-category.assigned / 100).toFixed(2)}`}{' '}
          </div>
          <div className="w-[15%] truncate text-right">
            {' '}
            {category.activity >= 0
              ? `$${(category.activity / 100).toFixed(2)}`
              : `-$${(-category.activity / 100).toFixed(2)}`}{' '}
          </div>
          <div className="w-[15%] truncate text-right">
            {' '}
            {category.available >= 0
              ? `$${(category.available / 100).toFixed(2)}`
              : `-$${(-category.available / 100).toFixed(2)}`}{' '}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BudgetTable
