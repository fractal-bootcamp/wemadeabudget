'use client'
import { categoryAdd, payeeAdd, transactionAdd } from '../actions/controller'
import { CategoryDetails, emptyTransaction, TransactionDetails } from '../types'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'
import { useState } from 'react'
import useBudgetStore from '../stores/transactionStore'
import Dropdown from './Dropdown/Dropdown'

const addNewPayee = (
  newPayeeName: string,
  storeSetter: (payeeName: string) => void
) => {
  console.log(`Adding new payee: ${newPayeeName}`)
  //optimistic update to store
  storeSetter(newPayeeName)
  //send to db
  payeeAdd(newPayeeName).then((res) => {
    console.log(`Payee added: ${JSON.stringify(res)}`)
  })
}

const addNewCategory = (
  newCategoryName: string,
  storeSetter: (details: CategoryDetails) => void
) => {
  const newCategory: CategoryDetails = { name: newCategoryName, allocated: 0 }
  console.log(`Adding new category: ${newCategory}`)
  //optimistic update to store
  storeSetter(newCategory)
  //send to db
  categoryAdd(newCategory).then((res) => {
    console.log(`Category added: ${JSON.stringify(res)}`)
  })
}
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
  const {
    accounts,
    payees,
    categories,
    addCategory,
    addPayee,
    addTransaction,
  } = useBudgetStore()
  const [formData, setFormData] = useState<TransactionDetails>(emptyTransaction)
  const [inflow, setInflow] = useState(0)
  const [outflow, setOutflow] = useState(0)
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
          <Dropdown
            options={payees}
            selected={formData.payee}
            addOptions={true}
            addOptionCallback={(newPayeeName: string) =>
              addNewPayee(newPayeeName, addPayee)
            }
            setSelected={(selection: string) => {
              setFormData({ ...formData, payee: selection })
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.category }}
          className="flex items-center truncate p-2 text-xs"
        >
          <Dropdown
            options={categories.map((category) => category.name)}
            selected={formData.category}
            addOptions={true}
            addOptionCallback={(newCategoryName: string) =>
              addNewCategory(newCategoryName, addCategory)
            }
            setSelected={(selection: string) => {
              setFormData({ ...formData, category: selection })
            }}
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
