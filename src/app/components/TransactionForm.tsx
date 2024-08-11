'use client'
import { categoryAdd, payeeAdd, transactionAdd, transactionUpdate } from '../actions/controller'
import { CategoryDetails, emptyTransaction, TransactionDetails } from '../types'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'
import { useState } from 'react'
import useBudgetStore from '../stores/transactionStore'
import Dropdown from './Dropdown/Dropdown'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown } from "lucide-react";

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
  existingTransaction?: TransactionDetails
}

function TransactionForm({
  columnWidths,
  showAccount,
  closeFunction,
  existingTransaction,
}: TransactionFormProps) {
  const {
    accounts,
    payees,
    categories,
    addCategory,
    addPayee,
    addTransaction,
    // updateTransaction,
  } = useBudgetStore()
  const [formData, setFormData] = useState<TransactionDetails>(
    existingTransaction || emptyTransaction
  )
  const [inflow, setInflow] = useState(formData.cents > 0 ? formData.cents / 100 : 0)
  const [outflow, setOutflow] = useState(formData.cents < 0 ? Math.abs(formData.cents) / 100 : 0)


  const updateTransaction = (details: TransactionDetails) => {
    console.log(`Updating transaction: ${JSON.stringify(details)}`)
    //send to db
    // transactionUpdate(details).then((res) => {
    //   console.log(`Transaction updated: ${JSON.stringify(res)}`)
    // })
    //optimistic update to store
    // storeSetter(details)
    //TODO: verify and sync store after db call response
  }

  const handleSubmit = () => {
    closeFunction()
    if (existingTransaction) {
      updateTransaction(formData)
    } else {
      addTransaction(formData)
    }
  }

  return (
    <div className="flex flex-col bg-indigo-100 text-xs">
      <div className="flex flex-row">
        {/* dummy always selected checkbox */}
        <div
          className="flex items-center justify-center py-2 px-1"
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
          className="flex items-center justify-center py-2 px-1"
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
            className="flex w-full items-center truncate py-2 px-1 text-xs"
          >
            <Dropdown
              options={accounts.map((account) => account.name)}
              selected={formData.account}
              label="Account"
              setSelected={(selection: string) => {
                setFormData({ ...formData, account: selection })
              }}
            />
          </div>
        )}
        <div
          style={{ width: columnWidths.date }}
          className="flex items-center py-2 px-1 text-xs"
        >
         <DatePicker
            selected={formData.date}
            onChange={(date: Date | null) => setFormData({ ...formData, date: date || new Date() })}
            dateFormat="MM-dd-yyyy"
            customInput={
                <div className="relative">
                    <input
                    value={formData.date ? formData.date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                    readOnly
                    className={`${formData.date ? 'text-black' : 'text-gray-400'} bg-white flex w-full items-center justify-between rounded-md border border-blue-700 py-1 px-2`}
                    style={{ width: '100%', maxWidth: '150px' }}
                    />
                    <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
            }
            
            />
        </div>
        <div
          style={{ width: columnWidths.payee }}
          className="flex items-center truncate py-2 px-1 text-xs"
        >
          <Dropdown
            options={payees}
            selected={formData.payee}
            addOptions={true}
            label="Payee"
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
          className="flex items-center truncate py-2 px-1 text-xs"
        >
          <Dropdown
            options={categories.map((category) => category.name)}
            selected={formData.category}
            label="Category"
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
          className="flex items-center truncate py-2 px-1 text-xs"
        >
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className={`${formData.memo.length === 0 ? 'text-gray-400' : 'text-black'} bg-white flex w-full items-center justify-between rounded-md border border-blue-700 py-1 pl-2 pr-2`}
          />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate py-2 px-1 text-xs"
        >
          <input
            type="number"
            name="outflow"
            step="0.01"
            placeholder="Outflow"
            className={`${outflow === 0 ? 'text-gray-400' : 'text-black'} bg-white flex w-full items-center justify-end rounded-md border border-blue-700 py-1 pl-2 pr-2 text-right`}
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
          className="flex items-center justify-end truncate py-2 px-1 text-xs"
        >
          <input
            type="number"
            name="inflow"
            placeholder="Inflow"
            className={`${inflow === 0 ? 'text-gray-400' : 'text-black'} bg-white flex w-full items-center justify-end rounded-md border border-blue-700 py-1 pl-2 pr-2 text-right`}
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
          className="flex items-center justify-center py-2 px-1"
        >
          <ClearedButton
            cleared={formData.cleared}
            onToggle={() =>
              setFormData({ ...formData, cleared: !formData.cleared })
            }
          />
        </div>
      </div>
      <div className="mr-16 flex flex-row justify-end mb-2 gap-2">
        <button
          className="rounded border border-indigo-600 px-2 py-1 text-indigo-600"
          type="button"
          onClick={closeFunction}
        >
          Cancel
        </button>
        <button
          className="rounded bg-blue-600 px-2 py-1 text-white"
          onClick={handleSubmit}
        >
        Save        </button>
      </div>
    </div>
  )
}

export default TransactionForm

