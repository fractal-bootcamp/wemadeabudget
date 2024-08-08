import { Bookmark } from 'lucide-react'

type TransactionFormProps = {
  columnWidths: { [key: string]: number }
  showAccount: boolean
  onCancel: () => void
  onSave: () => void
}

function TransactionForm({
  columnWidths,
  showAccount,
  onCancel,
  onSave,
}: TransactionFormProps) {
  return (
    <form className="flex flex-col bg-indigo-100 text-xs">
      <div className="flex flex-row">
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.flag }}
        >
          <input type="checkbox" className="rounded" />
        </div>
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.flag }}
        >
          <Bookmark
            className="rotate-[270deg] transform text-gray-400"
            size={16}
          />
        </div>
        {showAccount && (
          <div
            style={{ width: columnWidths.account }}
            className="flex items-center truncate p-2 text-xs"
          >
            <input type="text" placeholder="Account" className="mb-1 rounded" />
          </div>
        )}
        <div
          style={{ width: columnWidths.date }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input type="text" placeholder="Date" className="mb-1 rounded" />
        </div>
        <div
          style={{ width: columnWidths.payee }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input type="text" placeholder="Payee" className="mb-1 rounded" />
        </div>
        <div
          style={{ width: columnWidths.category }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input type="text" placeholder="Category" className="mb-1 rounded" />
        </div>
        <div
          style={{ width: columnWidths.memo }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input type="text" placeholder="Memo" className="mb-1 rounded" />
        </div>
        <div
          style={{ width: columnWidths.inflow }}
          className="flex items-center justify-end truncate p-2 text-xs"
        >
          <input type="text" placeholder="Inflow" className="mb-1 rounded" />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate p-2 text-xs"
        >
          <input type="text" placeholder="Outflow" className="mb-1 rounded" />
        </div>
        <button className="flex w-[50px] items-center justify-center p-2">
          <div
            className={`text-bold h-4 w-4 rounded-full border border-gray-400 bg-white text-center text-xs text-gray-600`}
          >
            C
          </div>
        </button>
      </div>
      <div className="mb-2 mr-16 flex flex-row justify-end gap-2">
        <button
          className="rounded border border-indigo-600 px-2 py-1 text-indigo-600"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="rounded bg-blue-600 px-2 py-1 text-white"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
