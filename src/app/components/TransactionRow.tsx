'use client'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { categoryAdd, payeeAdd, transactionAdd } from '../actions/controller'
import { CategoryDetails, emptyTransaction, TransactionDetails, Flag } from '../types'
import useBudgetStore from '../stores/transactionStore'
import Dropdown from './Dropdown/Dropdown'
import FlagToggle from './FlagToggle'
import ClearedButton from './ClearedButton'
import TransactionForm from './TransactionForm'

interface ColumnWidths {
  [key: string]: number;
  flag: number;
  account: number;
  checkbox: number;
  date: number;
  payee: number;
  category: number;
  memo: number;
  outflow: number;
  inflow: number;
}
interface TransactionRowProps {
  id: string
  account: string
  date: Date
  payee: string
  category: string
  memo: string
  cents: number
  cleared: boolean
  showAccount: boolean
  columnWidths: ColumnWidths
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onClick: () => void
  closeFunction: () => void
  toggleCleared: () => void
  isCleared: boolean
  flag: Flag
}

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

function TransactionRow({
  id,
  account,
  date,
  payee,
  category,
  memo,
  cents,
  cleared,
  showAccount,
  columnWidths,
  isEditing,
  isSelected,
  onSelect,
  onClick,
  closeFunction,
  toggleCleared,
  isCleared,
  flag,
}: TransactionRowProps) {
  const {
    accounts,
    payees,
    categories,
    addCategory,
    addPayee,
    addTransaction,
  } = useBudgetStore()
  const [formData, setFormData] = useState<TransactionDetails>(emptyTransaction)
  const [inflow, setInflow] = useState(cents > 0 ? cents / 100 : 0)
  const [outflow, setOutflow] = useState(cents < 0 ? Math.abs(cents) / 100 : 0)

  //TODO: Make edit mode show the same dropdowns as add mode
  return isEditing ? (
    <TransactionForm
    columnWidths={columnWidths}
    showAccount={showAccount}
    closeFunction={closeFunction}
    existingTransaction={{
      id,
      account,
      date,
      payee,
      category,
      memo,
      cents,
      cleared,
      flag,
    }}
  />
  ) : (
    <div
      className={`transaction-row flex ${isSelected ? 'bg-indigo-100' : ''}`}
      onClick={onClick}
    >
      <div
        className="flex flex-row items-center justify-center p-2"
        style={{ width: columnWidths.checkbox }}
      >
        <input
          type="checkbox"
          className="rounded"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          onClick={(e) => e.stopPropagation()} // Prevent row click when checkbox is clicked
        />
      </div>
      <div
        style={{ width: columnWidths.flag }}
        className="flex items-center justify-center p-2"
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
          <div className="truncate">{account}</div>
        </div>
      )}
      <div
        style={{ width: columnWidths.date }}
        className="flex items-center truncate p-2 text-xs"
      >
        <div className="truncate">{date.toLocaleDateString()}</div>
      </div>
      <div
        style={{ width: columnWidths.payee }}
        className="flex items-center truncate p-2 text-xs"
      >
        <div className="truncate">{payee}</div>
      </div>
      <div
        style={{ width: columnWidths.category }}
        className="flex items-center truncate p-2 text-xs"
      >
        <div className="truncate">{category}</div>
      </div>
      <div
        style={{ width: columnWidths.memo }}
        className="flex items-center truncate p-2 text-xs"
      >
        <div className="truncate">{memo}</div>
      </div>
      <div
        style={{ width: columnWidths.outflow }}
        className="flex items-center justify-end truncate p-2 text-xs"
      >
        <div className="truncate">
          {cents < 0 ? `-$${Math.abs(cents / 100).toFixed(2)}` : ''}
        </div>
      </div>
      <div
        style={{ width: columnWidths.inflow }}
        className="flex items-center justify-end truncate p-2 text-xs"
      >
        <div className="truncate">
          {cents > 0 ? `$${(cents / 100).toFixed(2)}` : ''}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(), toggleCleared()
        }}
        className="flex w-[50px] items-center justify-center p-2"
      >
        <div
          className={`h-4 w-4 rounded-full ${isCleared ? 'bg-green-600 text-white' : 'border border-gray-400 bg-white text-gray-600'} text-bold text-center text-xs`}
        >
          C
        </div>
      </button>
    </div>
  )
}

export default TransactionRow

