'use client'
import Sidebar from './Sidebar'
import AccountTable from './AccountTable/AccountTable'
import BudgetTable from './BudgetTable/BudgetTable'
import TransactionRow from './AccountTable/TransactionRow'
import {
  AccountDetails,
  CategoryDetails,
  PayeeDetails,
  TransactionDetails,
} from '../types'
import useBudgetStore, { useBudgetActions } from '../stores/transactionStore'
import { useEffect, useState } from 'react'
import Reflect from './ReflectPage/Reflect'

const pages = ['budget', 'reflect', 'accounts']
interface SandboxProps {
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  categories: CategoryDetails[]
  payees: PayeeDetails[]
}
function Sandbox({ transactions, accounts, categories, payees }: SandboxProps) {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState('budget')
  const loaded = useBudgetStore((state) => state.loaded)
  const { load, isLoaded, addTransaction, addAccount, addCategory, addPayee } =
    useBudgetActions()
  useEffect(() => {
    if (isLoaded()) return
    transactions.forEach(addTransaction)
    accounts.forEach(addAccount)
    categories.forEach(addCategory)
    payees.forEach(addPayee)
    load()
  }, [])
  return (
    <div className="flex h-screen">
      <Sidebar
        setCurrentAccount={(acctName: string | null) => {
          setCurrentPage('account')
          setCurrentAccount(acctName)
        }}
        setCurrentPage={setCurrentPage}
      />
      {(() => {
        switch (currentPage) {
          case 'account':
            return <AccountTable accountName={currentAccount} />
          case 'budget':
            return <BudgetTable />
          case 'reflect':
            return <Reflect />
        }
      })()}
    </div>
  )
}

export default Sandbox
