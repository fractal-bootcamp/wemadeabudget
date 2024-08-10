'use client'
import Sidebar from './Sidebar'
import AccountTable from './AccountTable/AccountTable'
import BudgetTable from './BudgetTable/BudgetTable'
import TransactionRow from './TransactionRow'
import { AccountDetails, CategoryDetails, TransactionDetails } from '../types'
import useBudgetStore from '../stores/transactionStore'
import { useEffect, useState } from 'react'
import Reflect from './ReflectPage/Reflect'

const pages = ['budget', 'reflect', 'accounts']
interface SandboxProps {
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  categories: CategoryDetails[]
  payees: string[]
}
function Sandbox({ transactions, accounts, categories, payees }: SandboxProps) {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState('budget')
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
      <Sidebar
        setCurrentAccount={(page: string | null) => {
          setCurrentPage('account')
          setCurrentAccount(page)
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
