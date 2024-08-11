'use client'
import TransactionRow from '../TransactionRow'
import { Bookmark } from 'lucide-react'
import ResizableColumn from '../ResizableColumn'
import TransactionForm from '../TransactionForm'
import { useState, useEffect, useMemo } from 'react'
import AccountsHeader from './AccountsHeader'
import ActionBar from './ActionBar'
import useBudgetStore from '../../stores/transactionStore'
const defaultCategories = [
  'Restaurants',
  'Rent',
  'Utilities',
  'Renters Insurance',
  'Phone',
  'Internet',
  'Music',
  'Groceries',
  'Train/Bus Fare',
  'Personal Care',
  'Stuff I Forgot to Budget For',
  'Celebrations',
]
//truncate to prevent overflow
interface AccountTableProps {
  accountName: string | null
}
function AccountTable({ accountName }: AccountTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [clearedRows, setClearedRows] = useState<Set<string>>(new Set())
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [showAddTransactionRow, setShowAddTransactionRow] = useState(false)
  const { getTransactionsByAccount, getAllTransactions } = useBudgetStore()
  const transactionRows = accountName
    ? getTransactionsByAccount(accountName)
    : getAllTransactions()
  const [columnWidths, setColumnWidths] = useState({
    flag: 50,
    checkbox: 40,
    account: 150,
    date: 130,
    payee: 200,
    category: 300,
    memo: 350,
    outflow: 120,
    inflow: 120,
    cleared: 50,
  })

  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      // Check if the double-click occurred outside of any row
      if (!(e.target as Element).closest('.transaction-row')) {
        setSelectedRows(new Set())
        setEditingRow(null)
      }
    }

    document.addEventListener('dblclick', handleDoubleClick)

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [])

  const onResize =
    (
      column: keyof typeof columnWidths,
      nextColumn: keyof typeof columnWidths
    ) =>
    (
      event: React.SyntheticEvent<Element, Event>,
      data: { size: { width: number; height: number } }
    ) => {
      const newWidth = data.size.width
      const widthDifference = newWidth - columnWidths[column]
      const nextColumnNewWidth = columnWidths[nextColumn] - widthDifference
      // Ensure the next column doesn't go below its minimum width
      const minWidth = 50 // You can adjust this or make it a parameter
      const maxWidth =
        columnWidths[column] + Math.max(columnWidths[nextColumn] - minWidth, 0)
      setColumnWidths((prev) => ({
        ...prev,
        [column]: Math.min(newWidth, maxWidth),
        [nextColumn]: Math.max(nextColumnNewWidth, minWidth),
      }))
    }

  function toggleRowSelect(rowId: string) {
    setShowAddTransactionRow(false)
    setEditingRow(null)
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  function toggleSelectAll() {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.size < transactionRows.length) {
        transactionRows.forEach((row) => newSet.add(row.id))
      } else {
        newSet.clear()
      }
      return newSet
    })
  }

  function handleRowClick(id: string) {
    if (selectedRows.has(id)) {
      // If the row is already selected, put it into edit mode
      setEditingRow(id)
      setSelectedRows(new Set(id))
    } else {
      // If the row is not selected, toggle its selection
      toggleRowSelect(id)
    }
  }

  function toggleCleared(id: string) {
    //this has gotta changed something in the db
    //but rn i'll change it locally
    setClearedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet // Return the updated set
    })
  }

  function toggleShowAddTransactionRow() {
    setShowAddTransactionRow((prev) => !prev)
    setSelectedRows(new Set())
    setEditingRow(null)
  }

  const closeEditingRow = () => {
    setEditingRow(null)
    setShowAddTransactionRow(false)
  }

  return (
    // i think this code is very redundant and might simplify later, but works
    <div className="w-full h-full overflow-x-scroll min-w-[750px]">
      <div className="min-w-full">
        <AccountsHeader accountName={accountName} />
        <ActionBar onAddTransaction={toggleShowAddTransactionRow} />
        <div className="flex flex-row items-stretch border-b border-l border-t border-gray-300 text-[10px] text-gray-500">
          <div
            className="container-class flex items-center justify-center border-r border-gray-300 p-2"
            style={{ width: columnWidths.checkbox }}
          >
            <input
              type="checkbox"
              className="h-4 w-4"
              onChange={() => toggleSelectAll()}
            />
          </div>
          <div
            className="flex justify-center border-r border-gray-300 p-2"
            style={{ width: columnWidths.flag }}
          >
            <Bookmark
              className="rotate-[270deg] transform text-gray-500"
              size={16}
            />
          </div>
          <ResizableColumn
            width={columnWidths.account}
            minWidth={50}
            maxWidth={
              columnWidths.account + Math.max(columnWidths.date - 50, 0)
            }
            onResize={onResize('account', 'date')}
          >
            <div className="flex pt-2">ACCOUNTS</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.date}
            minWidth={50}
            maxWidth={columnWidths.date + Math.max(columnWidths.payee - 50, 0)}
            onResize={onResize('date', 'payee')}
          >
            <div className="flex pt-2">DATE</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.payee}
            minWidth={50}
            maxWidth={
              columnWidths.payee + Math.max(columnWidths.category - 50, 0)
            }
            onResize={onResize('payee', 'category')}
          >
            <div className="flex pt-2">PAYEE</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.category}
            minWidth={50}
            maxWidth={
              columnWidths.category + Math.max(columnWidths.memo - 50, 0)
            }
            onResize={onResize('category', 'memo')}
          >
            <div className="flex pt-2">CATEGORY</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.memo}
            minWidth={50}
            maxWidth={
              columnWidths.memo + Math.max(columnWidths.outflow - 50, 0)
            }
            onResize={onResize('memo', 'outflow')}
          >
            <div className="flex pt-2">MEMO</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.outflow}
            minWidth={50}
            maxWidth={
              columnWidths.outflow + Math.max(columnWidths.inflow - 50, 0)
            }
            onResize={onResize('outflow', 'inflow')}
          >
            <div className="flex justify-end pt-2">OUTFLOW</div>
          </ResizableColumn>
          <div
            className="flex items-center justify-end border-r border-gray-300 px-2"
            style={{ width: columnWidths.inflow }}
          >
            INFLOW
          </div>

          <div
            className={`flex border-gray-300 p-2 w-[${columnWidths.cleared}px] items-center justify-center`}
          >
            <div className="text-bold h-4 w-4 rounded-full bg-green-600 text-center text-[12px] text-white">
              {' '}
              C{' '}
            </div>
          </div>
        </div>
      </div>
      {showAddTransactionRow && (
        <TransactionForm
          columnWidths={columnWidths}
          showAccount={true}
          closeFunction={closeEditingRow}
        />
      )}
      <div className="flex w-full flex-col">
        {transactionRows.map((row) => (
          <TransactionRow
            key={row.id}
            {...row}
            showAccount={true}
            columnWidths={columnWidths}
            isSelected={selectedRows.has(row.id)}
            isEditing={editingRow === row.id}
            onSelect={() => toggleRowSelect(row.id)}
            onClick={() => handleRowClick(row.id)}
            closeFunction={closeEditingRow}
            toggleCleared={() => toggleCleared(row.id)}
            isCleared={clearedRows.has(row.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default AccountTable
