'use client'
import TransactionRow from './TransactionRow'
import {
  Bookmark,
  LucideSearch,
  LucideUndo,
  LucideRedo,
  FileIcon,
  PlusCircle,
  SearchIcon,
  ChevronDown,
} from 'lucide-react'
import ResizableColumn from './ResizableColumn'
import TransactionForm from './TransactionForm'
import { useState, useEffect } from 'react'

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

const dummyRows = [
  {
    id: '1',
    account: 'Checking',
    date: '2023-01-01',
    payee: 'Trader Joe',
    category: 'Food',
    memo: 'Groceries',
    cents: -1000,
    cleared: true,
  },
  {
    id: '2',
    account: 'Savings',
    date: '2023-01-02',
    payee: 'Amazon',
    category: 'Shopping',
    memo: 'Books',
    cents: -500,
    cleared: false,
  },
  {
    id: '3',
    account: 'Credit Card',
    date: '2023-01-03',
    payee: 'Gas Station',
    category: 'Transport',
    memo: 'Fuel',
    cents: -400,
    cleared: true,
  },
  {
    id: '4',
    account: 'Checking',
    date: '2023-01-04',
    payee: 'Starbucks',
    category: 'Food',
    memo: 'Coffee',
    cents: -100,
    cleared: false,
  },
  {
    id: '5',
    account: 'Savings',
    date: '2023-01-05',
    payee: 'Netflix',
    category: 'Entertainment',
    memo: 'Subscription',
    cents: -150,
    cleared: true,
  },
  {
    id: '6',
    account: 'Checking',
    date: '2023-01-06',
    payee: 'Local Market',
    category: 'Food',
    memo: 'Fruits',
    cents: -300,
    cleared: false,
  },
  {
    id: '7',
    account: 'Checking',
    date: '2023-01-07',
    payee: 'Payroll',
    category: 'Income',
    memo: 'Salary',
    cents: 5000,
    cleared: true,
  },
  {
    id: '8',
    account: 'Savings',
    date: '2023-01-08',
    payee: 'Interest',
    category: 'Interest',
    memo: 'Interest Payment',
    cents: 200,
    cleared: true,
  },
]

const AccountsHeader = () => {
  return (
    //TODO make these numbers dynamic
    <div className="flex flex-col">
      <div className="mx-4 my-2 text-xl font-semibold"> All Accounts</div>
      <div className="flex w-full border-b border-t border-gray-300 p-2">
        <div className="flex flex-col px-2">
          <div> -$1400.00 </div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
              C
            </div>
            Cleared Balance
          </div>
        </div>
        <div className="px-2"> + </div>
        <div className="flex flex-col px-2">
          <div className="text-green-600"> $1400.00 </div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-gray-500 font-bold text-gray-500">
              C
            </div>
            Uncleared Balance
          </div>
        </div>
        <div className="px-2"> = </div>
        <div className="flex flex-col px-2">
          <div> $1400.00 </div>
          <div className="text-[10px]"> Working Balance </div>
        </div>
      </div>
    </div>
  )
}

function ActionBar({ onAddTransaction }: { onAddTransaction: () => void }) {
  return (
    <div className="flex flex-row justify-between p-3 text-sm text-indigo-600">
      <div className="flex flex-row gap-2">
        <button className="flex items-center gap-1" onClick={onAddTransaction}>
          <PlusCircle className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
        <button className="flex items-center gap-1">
          <FileIcon className="h-4 w-4" />
          <span>File Import</span>
        </button>
        <button className="flex items-center gap-1">
          <LucideUndo className="h-4 w-4" />
          <span>Undo</span>
        </button>
        <button className="flex items-center gap-1">
          <LucideRedo className="h-4 w-4" />
          <span>Redo</span>
        </button>
      </div>
      <div className="flex flex-row gap-2">
        <button className="flex gap-1">
          {' '}
          View <ChevronDown className="h-4 w-4" />
        </button>
        <div className="flex items-center">
          <SearchIcon className="mr-2 h-5 w-5" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  )
}

//truncate to prevent overflow

function AccountTable() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [clearedRows, setClearedRows] = useState<Set<string>>(new Set())
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [showAddTransactionRow, setShowAddTransactionRow] = useState(false)

  const [columnWidths, setColumnWidths] = useState({
    flag: 50,
    account: 100,
    date: 100,
    payee: 120,
    category: 120,
    memo: 210,
    outflow: 80,
    inflow: 80,
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
    (column: string) =>
    (
      event: React.SyntheticEvent<Element, Event>,
      data: { size: { width: number; height: number } }
    ) => {
      setColumnWidths((prev) => ({ ...prev, [column]: data.size.width }))
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
      if (newSet.size < dummyRows.length) {
        dummyRows.forEach((row) => newSet.add(row.id))
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
  }

  const closeEditingRow = () => {
    setEditingRow(null)
    setShowAddTransactionRow(false)
  }

  function handleCancelAddTransaction() {
    setShowAddTransactionRow(false)
  }

  return (
    // i think this code is very redundant and might simplify later, but works
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        <AccountsHeader />
        <ActionBar onAddTransaction={toggleShowAddTransactionRow} />
        <div className="flex flex-row items-stretch border-b border-l border-t border-gray-300 text-[10px] text-gray-500">
          <div className="flex w-[40px] items-center justify-center border-r border-gray-300 p-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              onChange={() => toggleSelectAll()}
            />
          </div>
          <ResizableColumn
            width={columnWidths.flag}
            minWidth={50}
            onResize={onResize('flag')}
          >
            <div className="flex p-2">
              <Bookmark
                className="rotate-[270deg] transform text-gray-500"
                size={16}
              />
            </div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.account}
            onResize={onResize('account')}
          >
            <div className="flex pt-2">ACCOUNTS</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.date}
            onResize={onResize('date')}
          >
            <div className="flex pt-2">DATE</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.payee}
            onResize={onResize('payee')}
          >
            <div className="flex pt-2">PAYEE</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.category}
            onResize={onResize('category')}
          >
            <div className="flex pt-2">CATEGORY</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.memo}
            onResize={onResize('memo')}
          >
            <div className="flex pt-2">MEMO</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.outflow}
            onResize={onResize('outflow')}
          >
            <div className="flex pt-2">OUTFLOW</div>
          </ResizableColumn>
          <ResizableColumn
            width={columnWidths.inflow}
            onResize={onResize('inflow')}
          >
            <div className="flex border-gray-300 pt-2">INFLOW</div>
          </ResizableColumn>
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
        {dummyRows.map((row) => (
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
