// LEGACY — original home page. Server component that pulled the user's full
// budget from Postgres before rendering. Replaced by a no-DB live version
// under src/app/page.tsx.

'use server'
import {
  dbAccountGetAllByUser,
  dbCategoryGetAllByUser,
  dbPayeeGetAllByUser,
  dbTransactionGetAllByUser,
} from './controller'
import Sandbox from '@/app/components/Sandbox'
const MIN_LOADING_TIME = 2000
export default async function Home() {
  const time = new Date().getTime()
  const transactions = await dbTransactionGetAllByUser()
  const accounts = await dbAccountGetAllByUser()
  const categories = await dbCategoryGetAllByUser()
  const payees = await dbPayeeGetAllByUser()
  const elapsed = new Date().getTime() - time
  const remainingTime = Math.max(MIN_LOADING_TIME - elapsed, 0)
  await new Promise((resolve) => setTimeout(resolve, remainingTime))

  return (
    <Sandbox
      transactions={transactions}
      accounts={accounts}
      categories={categories}
      payees={payees}
    />
  )
}
