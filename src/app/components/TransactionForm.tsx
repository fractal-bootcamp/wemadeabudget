'use client'
import { transactionAdd } from '../actions/controller'
import { emptyTransaction, TransactionDetails } from '../types'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'
import { useState } from 'react'
import useBudgetStore from '../stores/transactionStore'
import Dropdown from './Dropdown/Dropdown'

const submitTransaction = (
  formData: TransactionDetails,
  storeSetter: (data: TransactionDetails) => void
) => {
  console.log(`Submitting transaction: ${JSON.stringify(formData)}`)
  //send to db
  transactionAdd(formData).then((res) => {
    console.log(`Transaction added: ${JSON.stringify(res)}`)
  })
  //optimistic update to store
  storeSetter(formData)
}

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
  const { accounts, payees, categories } = useBudgetStore()
  const [formData, setFormData] = useState<TransactionDetails>(emptyTransaction)
  const [inflow, setInflow] = useState(0)
  const [outflow, setOutflow] = useState(0)
  const { addTransaction } = useBudgetStore()
  return (
    <form className="flex flex-col bg-indigo-100 text-xs">
      <div className="flex flex-row">
        {/* dummy always selected checkbox */}
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.checkbox }}
        >
          <input
            type="checkbox"
            readOnly
            className="pointer-events-none rounded"
            checked={true}
          />
        </div>
        {/* Flag */}
        <div
          className="flex items-center justify-center p-2"
          style={{ width: columnWidths.flag }}
        >
          <FlagToggle
            flag={formData.flag}
            onToggle={() =>
              setFormData((prev) => ({
                ...prev,
                flag: prev.flag === 'NONE' ? 'GREEN' : 'NONE',
              }))
            }
          />
        </div>
        {showAccount && (
          <div
            style={{ width: columnWidths.account }}
            className="flex items-center truncate p-2 text-xs"
          >
            <Dropdown
              options={accounts.map((account) => account.name)}
              selected={formData.account}
              setSelected={(selection: string) => {
                setFormData({ ...formData, account: selection })
              }}
            />
            {/* <input
              type="text"
              name="account"
              placeholder="Account"
              className="rounded px-2 py-1"
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              required
            /> */}
          </div>
        )}
        <div
          style={{ width: columnWidths.date }}
          className="flex items-center p-2 text-xs"
        >
          <input
            type="date"
            name="date"
            className="rounded px-2 py-1"
            required
            onChange={(e) => {
              const [year, month, day] = e.target.value.split('-').map(Number)
              setFormData({ ...formData, date: new Date(year, month - 1, day) })
            }}
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
            className="rounded px-2 py-1"
            value={formData.payee}
            onChange={(e) =>
              setFormData({ ...formData, payee: e.target.value })
            }
            required
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
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="rounded px-2 py-1"
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
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="rounded px-2 py-1"
          />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate p-2 text-xs"
        >
          <input
            type="number"
            name="outflow"
            step="0.01"
            placeholder="Outflow"
            className="rounded px-2 py-1"
            value={outflow || ''}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100)

              setInflow(0)
              setFormData({
                ...formData,
                cents: -cents,
              })
              setOutflow(cents / 100)
            }}
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
            className="rounded px-2 py-1"
            value={inflow || ''}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100)
              setOutflow(0)
              setFormData({
                ...formData,
                cents: cents,
              })
              setInflow(cents / 100)
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.cleared }}
          className="flex items-center justify-end p-2"
        >
          <ClearedButton
            cleared={formData.cleared}
            onToggle={() =>
              setFormData({ ...formData, cleared: !formData.cleared })
            }
          />
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
            submitTransaction(formData, addTransaction)
          }}
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
