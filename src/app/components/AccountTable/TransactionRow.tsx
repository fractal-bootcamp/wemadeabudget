'use client'
import { Bookmark } from 'lucide-react'
import TransactionForm from './TransactionForm'
import FlagToggle from './Flag/FlagToggle'
import {
  formatCentsToDollarString,
  METHODS,
  updateStoreAndDb,
} from '../../util/utils'
import { Flag, FlagDetails, TransactionDetails } from '../../types'
import { dbTransactionUpdate } from '../../actions/controller'
import useBudgetStore from '../../stores/transactionStore'

interface ColumnWidths {
  [key: string]: number
  flag: number
  account: number
  checkbox: number
  date: number
  payee: number
  category: number
  memo: number
  outflow: number
  inflow: number
}
interface TransactionRowProps {
  transactionDetails: TransactionDetails
  showAccount: boolean
  columnWidths: ColumnWidths
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onClick: () => void
  closeFunction: () => void
}

function TransactionRow({
  transactionDetails,
  showAccount,
  columnWidths,
  isEditing,
  isSelected,
  onSelect,
  onClick,
  closeFunction,
}: TransactionRowProps) {
  const { account, date, payee, category, memo, cents, cleared, flag } =
    transactionDetails
  const { updateTransaction } = useBudgetStore()
  const toggleCleared = () => {
    const newTransaction: TransactionDetails = {
      ...transactionDetails,
      cleared: !cleared,
    }
    updateStoreAndDb({
      dbFunction: dbTransactionUpdate,
      storeFunction: updateTransaction,
      payload: newTransaction,
      method: METHODS.UPDATE,
    })
  }
  const setFlag = (flag: Flag) => {
    const newTransaction: TransactionDetails = {
      ...transactionDetails,
      flag,
    }
    updateStoreAndDb({
      dbFunction: dbTransactionUpdate,
      storeFunction: updateTransaction,
      payload: newTransaction,
      method: METHODS.UPDATE,
    })
  }
  //TODO: Make edit mode show the same dropdowns as add mode
  return isEditing ? (
    <TransactionForm
      columnWidths={columnWidths}
      showAccount={showAccount}
      closeFunction={closeFunction}
      existingTransaction={transactionDetails}
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
        <FlagToggle
          currentFlag={transactionDetails.flag}
          onFlagSelect={setFlag}
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
          {cents < 0 ? formatCentsToDollarString(cents) : ''}
        </div>
      </div>
      <div
        style={{ width: columnWidths.inflow }}
        className="flex items-center justify-end truncate p-2 text-xs"
      >
        <div className="truncate">
          {cents > 0 ? formatCentsToDollarString(cents) : ''}
        </div>
      </div>
      <div className="flex w-[50px] items-center justify-center p-2">
        <div
          className={`h-4 w-4 cursor-pointer rounded-full ${cleared ? 'bg-green-600 text-white' : 'border border-gray-400 bg-white text-gray-600'} text-bold text-center text-xs`}
          onClick={(e) => {
            e.stopPropagation()
            toggleCleared()
          }}
        >
          C
        </div>
      </div>
    </div>
  )
}

export default TransactionRow
