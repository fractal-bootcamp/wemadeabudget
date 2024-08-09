'use server'
import { transactionGetAllByUser } from './actions/controller'
import Sandbox from './components/Sandbox'
import { useEffect } from 'react'
import useTransactionStore from './stores/transactionStore'
const MIN_LOADING_TIME = 2000
export default async function Home() {
  const time = new Date().getTime()
  const transactions = await transactionGetAllByUser()
  const elapsed = new Date().getTime() - time
  const remainingTime = MIN_LOADING_TIME - elapsed
  await new Promise((resolve) => setTimeout(resolve, remainingTime))

  return <Sandbox transactions={transactions} />
}
