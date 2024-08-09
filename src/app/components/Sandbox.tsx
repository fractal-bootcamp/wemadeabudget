'use client'
import Sidebar from './Sidebar'
import AccountTable from './AccountTable/AccountTable'
import BudgetTable from './BudgetTable'
import TransactionRow from './TransactionRow'
import { AccountDetails, CategoryDetails, TransactionDetails } from '../types'
import useBudgetStore from '../stores/transactionStore'
import { useEffect } from 'react'

interface SandboxProps {
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  categories: CategoryDetails[]
  payees: string[]
}
function Sandbox({ transactions, accounts, categories, payees }: SandboxProps) {
  const { isLoaded, load, addTransaction, addAccount, addCategory, addPayee } =
    useBudgetStore()
  useEffect(() => {
    console.log('loading store')
    if (isLoaded()) return
    transactions.forEach(addTransaction)
    accounts.forEach(addAccount)
    categories.forEach(addCategory)
    payees.forEach(addPayee)
    load()
  }, [])
  return (
    <div className="flex">
      <Sidebar />
      <AccountTable />
    </div>
  )
}

export default Sandbox
