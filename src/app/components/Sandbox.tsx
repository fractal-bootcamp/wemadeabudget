'use client'
import Sidebar from './Sidebar'
import AccountTable from './AccountTable'
import BudgetTable from './BudgetTable'
import TransactionRow from './TransactionRow'
import { TransactionDetails } from '../types'
import useTransactionStore from '../stores/transactionStore'
import { useEffect } from 'react'

function Sandbox({ transactions }: { transactions: TransactionDetails[] }) {
  const { addTransactions } = useTransactionStore()
  useEffect(() => {
    addTransactions(transactions)
    console.log(transactions)
  }, [])
  return (
    <div className="flex">
      <Sidebar />
      <AccountTable />
    </div>
  )
}

export default Sandbox
