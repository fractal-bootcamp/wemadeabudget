import { Bookmark } from 'lucide-react'
import { transactionAdd } from '../actions/controller'
import { TransactionDetails } from '../types'
import FlagToggle from './FlagToggle'

type TransactionFormProps = {
  columnWidths: { [key: string]: number }
  showAccount: boolean
  onCancel: () => void
  onSave: () => void
}

interface TransactionFormData {
  inflow: string
  outflow: string
  flag: string
  account: string
  date: string
  payee: string
  category: string
  memo: string
}

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
  onSave: () => void
) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const dateString = formData.get('date') as string
  const date = new Date(dateString)
  const flag = formData.get('flag') === 'true' ? true : false
  const cents =
    (parseFloat((formData.get('inflow') as string) ?? '0') -
      parseFloat((formData.get('outflow') as string) ?? '0')) *
    100
  const data: TransactionDetails = {
    flag: flag ? 'GREEN' : 'NONE', //TODO: add flags
    account: (formData.get('account') as string) ?? '',
    date,
    payee: (formData.get('payee') as string) ?? '',
    category: (formData.get('category') as string) ?? '',
    memo: (formData.get('memo') as string) ?? '',
  }

  try {
    await transactionAdd({ ...data, cents, id: null, cleared: false })
    onSave()
  } catch (error) {
    console.error('Error adding transaction:', error)
  }
}

function TransactionForm({
  columnWidths,
  showAccount,
  onCancel,
  onSave,
}: TransactionFormProps) {
  return (
    <form
      className="flex flex-col bg-indigo-100 text-xs"
      onSubmit={(e) => handleSubmit(e, onSave)}
    >
      <div className="flex flex-row">
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.checkbox }}
        >
          <input type="checkbox" className="rounded" />
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
            className="mb-1 rounded"
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
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
