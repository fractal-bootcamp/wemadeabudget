'use client'
import Sidebar from './Sidebar'
import AccountTable from './AccountTable'
import BudgetTable from './BudgetTable'
import TransactionRow from './TransactionRow'

function Sandbox() {
  return (
    <div className="flex">
      <Sidebar />
      <AccountTable />
    </div>
  )
}

export default Sandbox
