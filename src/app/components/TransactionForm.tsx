'use client'
import { transactionAdd } from '../actions/controller'
import { TransactionDetails } from '../types'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'

type TransactionFormProps = {
  columnWidths: { [key: string]: number }
  showAccount: boolean
  closeFunction: () => void
}

function TransactionForm({
  columnWidths,
  showAccount,
  closeFunction,
}: TransactionFormProps) {
  return (
    <form className="flex flex-col bg-indigo-100 text-xs">
      <div className="flex flex-row">
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.checkbox }}
        >
          <input
            type="checkbox"
            className="pointer-events-none rounded"
            checked={true}
          />
        </div>
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.flag }}
        >
          <FlagToggle />
        </div>
        {showAccount && (
          <div
            style={{ width: columnWidths.account }}
            className="flex items-center truncate p-2 text-xs"
          >
            <input
              type="text"
              name="account"
              placeholder="Account"
              className="mb-1 rounded"
            />
          </div>
        )}
        <div
          style={{ width: columnWidths.date }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input
            type="date"
            name="date"
            placeholder="Date"
            className="mb-1 rounded px-2 py-1"
            required
          />
        </div>
        <div
          style={{ width: columnWidths.payee }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input
            type="text"
            name="payee"
            placeholder="Payee"
            className="mb-1 rounded"
          />
        </div>
        <div
          style={{ width: columnWidths.category }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="mb-1 rounded"
          />
        </div>
        <div
          style={{ width: columnWidths.memo }}
          className="flex items-center truncate p-2 text-xs"
        >
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            className="mb-1 rounded"
          />
        </div>
        <div
          style={{ width: columnWidths.inflow }}
          className="flex items-center justify-end truncate p-2 text-xs"
        >
          <input
            type="number"
            name="inflow"
            placeholder="Inflow"
            className="mb-1 rounded"
          />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate p-2 text-xs"
        >
          <input
            type="number"
            name="outflow"
            placeholder="Outflow"
            className="mb-1 rounded"
          />
        </div>
        <div
          style={{ width: columnWidths.cleared }}
          className="flex items-center justify-end p-2"
        >
          <ClearedButton />
        </div>
      </div>
      <div className="mb-2 mr-16 flex flex-row justify-end gap-2">
        <button
          className="rounded border border-indigo-600 px-2 py-1 text-indigo-600"
          type="button"
          onClick={closeFunction}
        >
          Cancel
        </button>
        <button
          className="rounded bg-blue-600 px-2 py-1 text-white"
          onClick={() => {
            closeFunction()
          }}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
