import { Pen } from 'lucide-react'
import { AccountDetails } from '../../types'
import { formatCentsToDollarString } from '../../util/utils'
import { useBudgetActions } from '../../stores/transactionStore'
type AccountWithBalance = AccountDetails & { balance: number }
type SidebarAccountProps = {
  account: AccountWithBalance
  setEditingAccount: (account: AccountDetails) => void
  setCurrentAccount: (accountName: string) => void
}
export default function SidebarAccount({
  account,
  setCurrentAccount,
  setEditingAccount,
}: SidebarAccountProps) {
  return (
    <div
      className="group flex cursor-pointer flex-row items-center rounded-md py-1 text-xs hover:bg-[#374D9B]"
      key={account.name}
      onClick={() => setCurrentAccount(account.name)}
    >
      <div className="flex h-3 w-6 flex-row items-center justify-start px-1 text-white opacity-50 hover:opacity-100">
        <Pen
          onClick={(e) => {
            e.stopPropagation()
            setEditingAccount(account)
          }}
          size={10}
          className="hidden transition-all duration-200 group-hover:block"
        />
      </div>
      <div className="flex w-full flex-row justify-between py-1 pr-2 text-xs">
        <button className="flex w-full flex-row justify-between text-xs">
          <div> {account.name} </div>
          <div
            className="flex px-1 text-xs"
            style={
              account.balance > 0
                ? { color: 'white' }
                : {
                    color: '#d10000',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    opacity: 0.8,
                  }
            }
          >
            {formatCentsToDollarString(account.balance)}
          </div>
        </button>
      </div>
    </div>
  )
}
