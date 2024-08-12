'use client'
import { Bookmark } from 'lucide-react'
import TransactionForm from './TransactionForm'
import { formatCentsToDollarString } from '../util/utils'
import { Flag, flagColors, TransactionDetails } from '../types'

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
  toggleCleared: () => void
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
  toggleCleared,
}: TransactionRowProps) {
  const { account, date, payee, category, memo, cents, cleared, flag } =
    transactionDetails
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
        <Bookmark
          className="rotate-[270deg] transform text-gray-400"
          size={16}
          fill={flagColors[flag]}
        />
      </div>
      {showAccount && (
        <div
          style={{ width: columnWidths.account }}
          className="flex items-center truncate p-2 text-sm"
        >
          <div className="truncate">{account}</div>
        </div>
      )}
      <div
        style={{ width: columnWidths.date }}
        className="flex items-center truncate p-2 text-sm"
      >
        <div className="truncate">{date.toLocaleDateString()}</div>
      </div>
      <div
        style={{ width: columnWidths.payee }}
        className="flex items-center truncate p-2 text-sm"
      >
        <div className="truncate">{payee}</div>
      </div>
      <div
        style={{ width: columnWidths.category }}
        className="flex items-center truncate p-2 text-sm"
      >
        <div className="truncate">{category}</div>
      </div>
      <div
        style={{ width: columnWidths.memo }}
        className="flex items-center truncate p-2 text-sm"
      >
        <div className="truncate">{memo}</div>
      </div>
      <div
        style={{ width: columnWidths.outflow }}
        className="flex items-center justify-end truncate p-2 text-sm"
      >
        <div className="truncate">
          {cents < 0 ? formatCentsToDollarString(cents) : ''}
        </div>
      </div>
      <div
        style={{ width: columnWidths.inflow }}
        className="flex items-center justify-end truncate p-2 text-sm"
      >
        <div className="truncate">
          {cents > 0 ? formatCentsToDollarString(cents) : ''}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(), toggleCleared()
        }}
        className="flex w-[50px] items-center justify-center p-2"
      >
        <div
          className={`h-4 w-4 rounded-full ${cleared ? 'bg-green-600 text-white' : 'border border-gray-400 bg-white text-gray-600'} text-bold text-center text-xs`}
        >
          C
        </div>
      </button>
    </div>
  )
}

export default TransactionRow
