import { PlusCircle, LucideUndo, LucideRedo } from 'lucide-react'
import { CategoryDetails } from '../../types'
import AddCategoryModal from './AddCategoryModal'
interface BudgetActionBarProps {
  showModal: boolean
  toggleShowModal: () => void
}
export default function BudgetActionBar({
  toggleShowModal,
  showModal,
}: BudgetActionBarProps) {
  return (
    <>
      <div className="flex flex-row gap-4 border-b border-l border-t border-gray-300 p-2 text-indigo-600">
        <div className="relative">
          <button onClick={toggleShowModal} className="flex gap-1 text-xs">
            <PlusCircle className="h-4 w-4" /> Category{' '}
          </button>
          {showModal && <AddCategoryModal toggleShowModal={toggleShowModal} />}
        </div>
        <button className="flex gap-1 text-xs text-indigo-300">
          <LucideUndo className="h-4 w-4" /> Undo{' '}
        </button>
        <button className="flex gap-1 text-xs text-indigo-300">
          <LucideRedo className="h-4 w-4" /> Redo{' '}
        </button>
      </div>
    </>
  )
}
