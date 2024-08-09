'use server'
import { transactionGetAllByUser } from './actions/controller'
import Sandbox from './components/Sandbox'
const MIN_LOADING_TIME = 2000
export default async function Home() {
  const time = new Date().getTime()
  const transactions = await transactionGetAllByUser()
  const elapsed = new Date().getTime() - time
  const remainingTime = Math.max(MIN_LOADING_TIME - elapsed, 0)
  await new Promise((resolve) => setTimeout(resolve, remainingTime))

  return <Sandbox transactions={transactions} />
}
