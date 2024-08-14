import { Trash, X } from 'lucide-react'
import { METHODS, updateStoreAndDb } from '../../util/utils'
import { dbTransactionDelete } from '../../actions/controller'
import useBudgetStore from '../../stores/transactionStore'

type BulkActionsModalProps = {
  selectedIds: Set<string>
  clearSelection: () => void
}
export default function BulkActionsModal({
  selectedIds,
  clearSelection,
}: BulkActionsModalProps) {
  const { deleteTransaction, updateTransaction } = useBudgetStore((state) => ({
    deleteTransaction: state.deleteTransaction,
    updateTransaction: state.updateTransaction,
  }))
  const ids = Array.from(selectedIds)
  const bulkDeleteTransactions = () => {
    ids.forEach((id) => {
      updateStoreAndDb({
        dbFunction: dbTransactionDelete,
        storeFunction: deleteTransaction,
        payload: id,
        method: 'DELETE',
      })
    })
  }
  const bulkUpdateTransactions = () => {}

  return (
    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform items-center justify-between gap-3 rounded-lg bg-indigo-900 p-2 text-slate-100">
      <button
        onClick={clearSelection}
        className="flex items-center rounded-lg bg-opacity-50 p-2 text-xs hover:cursor-pointer hover:bg-indigo-500"
      >
        <X size={18} className="mr-2" /> {ids.length} selected
      </button>
      <button
        onClick={() => {
          bulkDeleteTransactions()
          clearSelection()
        }}
        className="rounded-lg p-2 hover:cursor-pointer hover:bg-indigo-500"
      >
        <Trash size={20} />
      </button>
    </div>
  )
}
