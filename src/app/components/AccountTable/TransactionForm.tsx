'use client'
import {
  CategoryDetails,
  emptyTransaction,
  TransactionDetails,
} from '../../types'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'
import { useState } from 'react'
import useBudgetStore from '../../stores/transactionStore'
import Dropdown from '../Dropdown/Dropdown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ChevronDown } from 'lucide-react'
import { updateStoreAndDb } from '../../util/utils'
import {
  dbCategoryAdd,
  dbPayeeAdd,
  dbTransactionAdd,
  dbTransactionUpdate,
} from '../../actions/controller'

type TransactionFormProps = {
  columnWidths: { [key: string]: number }
  showAccount: boolean
  closeFunction: () => void
  existingTransaction?: TransactionDetails
  accountName?: string
}

function TransactionForm({
  columnWidths,
  showAccount,
  closeFunction,
  existingTransaction,
  accountName,
}: TransactionFormProps) {
  const {
    accounts,
    payees,
    categories,
    addCategory,
    addPayee,
    addTransaction,
    updateTransaction,
  } = useBudgetStore()
  const [formData, setFormData] = useState<TransactionDetails>(
    existingTransaction || { ...emptyTransaction, account: accountName || '' }
  )

  const [inflow, setInflow] = useState(
    formData.cents > 0 ? formData.cents / 100 : 0
  )
  const [outflow, setOutflow] = useState(
    formData.cents < 0 ? Math.abs(formData.cents) / 100 : 0
  )
  const dbFunc = existingTransaction ? dbTransactionUpdate : dbTransactionAdd
  const storeFunc = existingTransaction ? updateTransaction : addTransaction
  return (
    <div className="flex flex-col gap-1 bg-indigo-100 px-0 py-2 text-xs">
      {/* Details/edit fields */}
      <div className="flex flex-row gap-0 px-1">
        {/* dummy always selected checkbox */}
        <div
          className="flex items-center justify-center px-1"
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
          className="flex items-center justify-center px-1"
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
            className="flex w-full items-center truncate px-1 text-xs"
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
          className="flex items-center px-1 text-xs"
        >
          <DatePicker
            selected={formData.date}
            onChange={(date: Date | null) =>
              setFormData({ ...formData, date: date || new Date() })
            }
            dateFormat="MM-dd-yyyy"
            customInput={
              <div className="relative">
                <input
                  value={
                    formData.date
                      ? formData.date.toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : ''
                  }
                  readOnly
                  className={`${formData.date ? 'text-black' : 'text-gray-400'} flex w-full items-center justify-between rounded-md border border-blue-700 bg-white px-2 py-1`}
                  style={{ width: '100%', maxWidth: '150px' }}
                />
                <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            }
          />
        </div>
        <div
          style={{ width: columnWidths.payee }}
          className="flex items-center truncate px-1 text-xs"
        >
          <Dropdown
            options={payees}
            selected={formData.payee}
            addOptions={true}
            label="Payee"
            addOptionCallback={(newPayeeName: string) => {
              updateStoreAndDb({
                dbFunction: dbPayeeAdd,
                storeFunction: addPayee,
                payload: newPayeeName,
                method: 'ADD',
              })
              setFormData({ ...formData, payee: newPayeeName })
            }}
            setSelected={(selection: string) => {
              setFormData({ ...formData, payee: selection })
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.category }}
          className="flex items-center truncate px-1 text-xs"
        >
          <Dropdown
            options={categories.map((category) => category.name)}
            selected={formData.category}
            label="Category"
            addOptions={true}
            addOptionCallback={(newCategoryName: string) => {
              const payload: CategoryDetails = {
                name: newCategoryName,
                allocated: 0,
                permanent: false,
              }
              updateStoreAndDb({
                dbFunction: dbCategoryAdd,
                storeFunction: addCategory,
                payload,
                method: 'ADD',
              })
              setFormData({ ...formData, category: newCategoryName })
            }}
            setSelected={(selection: string) => {
              setFormData({ ...formData, category: selection })
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.memo }}
          className="flex items-center truncate px-1 text-xs"
        >
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className={`${formData.memo.length === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-between rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2`}
          />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate px-1 text-xs"
        >
          <input
            type="number"
            name="outflow"
            step="0.01"
            placeholder="Outflow"
            className={`${outflow === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-end rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2 text-right`}
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
          className="flex items-center justify-end truncate px-1 text-xs"
        >
          <input
            type="number"
            name="inflow"
            placeholder="Inflow"
            className={`${inflow === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-end rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2 text-right`}
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
          className="flex items-center justify-center px-1"
        >
          <ClearedButton
            cleared={formData.cleared}
            onToggle={() =>
              setFormData({ ...formData, cleared: !formData.cleared })
            }
          />
        </div>
      </div>
      {/* Buttons */}
      <div
        className="flex flex-row justify-end gap-2"
        style={{ marginRight: `${columnWidths.cleared}px` }}
      >
        <button
          className="rounded-lg border border-indigo-600 px-4 py-1 text-indigo-600"
          type="button"
          onClick={closeFunction}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-blue-600 px-4 py-1 text-white"
          onClick={() => {
            updateStoreAndDb({
              dbFunction: dbFunc,
              storeFunction: storeFunc,
              payload: formData,
              method: 'ADD',
            })
            closeFunction()
          }}
        >
          Save{' '}
        </button>
      </div>
    </div>
  )
}

export default TransactionForm
