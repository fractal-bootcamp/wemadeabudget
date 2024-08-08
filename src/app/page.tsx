'use client'
import { transactionGetAllByUser } from './actions/controller'
import Sandbox from './components/Sandbox'
import { useEffect } from 'react'
import useTransactionStore from './stores/transactionStore'

export default function Home() {
  const { addTransactions } = useTransactionStore()
  useEffect(() => {
    const actualEffect = async () => {
      const transactions = await transactionGetAllByUser()

      addTransactions(transactions)
      console.log(transactions)
    }
    actualEffect()
  }, [])

  return <Sandbox />
}
