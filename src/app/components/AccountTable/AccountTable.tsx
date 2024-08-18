'use client'
import TransactionRow from './TransactionRow'
import { Bookmark } from 'lucide-react'
import ResizableColumn from '../ResizableColumn'
import TransactionForm from './TransactionForm'
import { useState, useEffect, useMemo, useRef } from 'react'
import AccountsHeader from './AccountsHeader'
import ActionBar from './ActionBar'
import { useBudgetActions } from '../../stores/transactionStore'
import { TransactionDetails } from '../../types'
import BulkActionsModal from './BulkActionsModal'

//truncate to prevent overflow
interface AccountTableProps {
  accountName: string | null
}
function AccountTable({ accountName }: AccountTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const selectAllRef = useRef<HTMLInputElement>(null)
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [showAddTransactionRow, setShowAddTransactionRow] = useState(false)
  const { getTransactionsByAccount, getAllTransactions } = useBudgetActions()
  const transactionRows = accountName
    ? getTransactionsByAccount(accountName)
    : getAllTransactions()
  const filteredTransactions = transactionRows.filter((transaction) => {
    return (
      searchTerm === '' ||
      transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
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

  const toggleSelectAll = () => {
    const anySelected = selectedRows.size > 0
    setSelectedRows(
      anySelected ? new Set() : new Set(transactionRows.map((c) => c.id))
    )
  }

  function handleRowClick(id: string) {
    if (selectedRows.has(id)) {
      // If the row is already selected, put it into edit mode
      setEditingRow(id)
      setSelectedRows(new Set([id]))
    } else {
      // If the row is not selected, toggle its selection
      toggleRowSelect(id)
    }
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

  useEffect(() => {
    if (!selectAllRef.current) return
    //set to checked if all are now selected
    selectAllRef.current.checked = selectedRows.size === transactionRows.length
    //set to indeterminate if any but not all are selected
    selectAllRef.current.indeterminate =
      selectedRows.size > 0 && selectedRows.size < transactionRows.length
  }, [selectedRows])

  return (
    <>
      <div className="relative h-full w-full min-w-[750px]">
        {selectedRows.size > 0 && (
          <BulkActionsModal
            selectedIds={selectedRows}
            clearSelection={() => {
              setSelectedRows(new Set())
              setEditingRow(null)
            }}
          />
        )}
        <div className="min-w-full">
          <AccountsHeader accountName={accountName} />
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onAddTransaction={toggleShowAddTransactionRow}
          />
          <div className="flex flex-row items-stretch border-b border-l border-t border-gray-300 text-[10px] text-gray-500">
            <div
              className="container-class flex items-center justify-center border-r border-gray-300 p-2"
              style={{ width: columnWidths.checkbox }}
            >
              <input
                ref={selectAllRef}
                type="checkbox"
                className=""
                onChange={toggleSelectAll}
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
            {!accountName && (
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
            )}
            <ResizableColumn
              width={columnWidths.date}
              minWidth={50}
              maxWidth={
                columnWidths.date + Math.max(columnWidths.payee - 50, 0)
              }
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
            showAccount={!accountName}
            accountName={accountName || ''}
            closeFunction={closeEditingRow}
          />
        )}
        <div className="flex w-full flex-col">
          {filteredTransactions.map((row) => (
            <TransactionRow
              key={row.id}
              transactionDetails={row}
              showAccount={!accountName}
              columnWidths={columnWidths}
              isSelected={selectedRows.has(row.id)}
              isEditing={editingRow === row.id}
              onSelect={() => toggleRowSelect(row.id)}
              onClick={() => handleRowClick(row.id)}
              closeFunction={closeEditingRow}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default AccountTable
