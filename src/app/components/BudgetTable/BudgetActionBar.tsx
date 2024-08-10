import { PlusCircle, LucideUndo, LucideRedo } from 'lucide-react'
import { CategoryDetails } from '../../types'
import AddCategoryModal from './AddCategoryModal'
interface BudgetActionBarProps {
  showModal: boolean
  toggleShowModal: () => void
  onSave: (
    name: string,
    storeSetter: (details: CategoryDetails) => void
  ) => void
}
export default function BudgetActionBar({
  toggleShowModal,
  onSave,
  showModal,
}: BudgetActionBarProps) {
  return (
    <>
      <div className="flex flex-row gap-4 border-b border-l border-t border-gray-300 p-2 text-indigo-600">
        <div className="relative">
          <button onClick={toggleShowModal} className="flex gap-1 text-xs">
            <PlusCircle className="h-4 w-4" /> Category{' '}
          </button>
          {showModal && (
            <AddCategoryModal onCancel={toggleShowModal} onSave={onSave} />
          )}
        </div>
        <button className="flex gap-1 text-xs">
          <LucideUndo className="h-4 w-4" /> Undo{' '}
        </button>
        <button className="flex gap-1 text-xs">
          <LucideRedo className="h-4 w-4" /> Redo{' '}
        </button>
      </div>
    </>
  )
}
