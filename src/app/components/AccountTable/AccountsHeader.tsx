import { UserButton } from "@clerk/nextjs"
import useBudgetStore from '../../stores/transactionStore' // Adjust the import path as needed

interface AccountsHeaderProps {
  accountName: string | null
}

const AccountsHeader = ({ accountName }: AccountsHeaderProps) => {
  const getBalanceByAccount = useBudgetStore(state => state.getBalanceByAccount)
  const transactions = useBudgetStore(state => state.transactions)

  const clearedBalance = accountName 
    ? getBalanceByAccount(accountName) / 100 
    : transactions.reduce((acc, t) => t.cleared ? acc + t.cents : acc, 0) / 100

  const unclearedBalance = accountName
    ? transactions.filter(t => t.account === accountName && !t.cleared).reduce((acc, t) => acc + t.cents, 0) / 100
    : transactions.reduce((acc, t) => !t.cleared ? acc + t.cents : acc, 0) / 100

  const workingBalance = clearedBalance + unclearedBalance

  return (
    <div className="flex flex-col">
      <div className="mx-4 my-2 text-xl font-semibold flex justify-between">
        {accountName ?? 'All Accounts'}
        <UserButton />
      </div>
      <div className="flex w-full border-b border-t border-gray-300 p-2">
        <div className="flex flex-col px-2">
          <div>{clearedBalance.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
              C
            </div>
            Cleared Balance
          </div>
        </div>
        <div className="px-2"> + </div>
        <div className="flex flex-col px-2">
          <div className="text-green-600">{unclearedBalance.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="flex h-3 w-3 items-center justify-center rounded-full border border-gray-500 font-bold text-gray-500">
              C
            </div>
            Uncleared Balance
          </div>
        </div>
        <div className="px-2"> = </div>
        <div className="flex flex-col px-2">
          <div>{workingBalance.toFixed(2)}</div>
          <div className="text-[10px]"> Working Balance </div>
        </div>
      </div>
    </div>
  )
}

export default AccountsHeader
