import { Inbox, Trash, X } from 'lucide-react'
import { METHODS, updateStoreAndDb } from '../../util/utils'
import {
  dbTransactionDelete,
  dbTransactionDeleteTransfer,
} from '../../actions/controller'
import useBudgetStore, { useBudgetActions } from '../../stores/transactionStore'

type BulkActionsModalProps = {
  selectedIds: Set<string>
  clearSelection: () => void
}
export default function BulkActionsModal({
  selectedIds,
  clearSelection,
}: BulkActionsModalProps) {
  const {
    deleteTransaction,
    updateTransaction,
    deleteTransfer,
    getTransactionById,
  } = useBudgetActions()
  const ids = Array.from(selectedIds)
  const transactions = ids.map(getTransactionById)

  const bulkDeleteTransactions = () => {
    transactions.forEach((transaction) => {
      updateStoreAndDb({
        dbFunction: transaction.transfer
          ? dbTransactionDeleteTransfer
          : dbTransactionDelete,
        storeFunction: transaction.transfer
          ? deleteTransfer
          : deleteTransaction,
        payload: transaction.id,
        method: METHODS.DELETE,
      })
    })
  }
  const bulkRecategorizeTransactions = () => {}

  return (
    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform items-center justify-between gap-3 rounded-lg bg-indigo-900 p-2 text-sm text-slate-100">
      <button
        onClick={clearSelection}
        className="flex items-center gap-2 rounded-lg bg-opacity-50 p-2 hover:cursor-pointer hover:bg-indigo-500"
      >
        <X size={18} /> {ids.length} selected
      </button>
      <button
        onClick={bulkRecategorizeTransactions}
        data-tip="Not implemented"
        className="tooltip flex gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-indigo-500"
      >
        <Inbox size={20} /> Categorize
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
