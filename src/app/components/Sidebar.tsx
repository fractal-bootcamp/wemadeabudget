import {
  Sprout,
  Landmark,
  Inbox,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Pen,
} from 'lucide-react'
import { useState } from 'react'
import AddAccountModal from './AddAccountModal'
import { useUser } from '@clerk/nextjs'
import useBudgetStore from '../stores/transactionStore'

const formatCurrency = (cents: number) => {
  const dollars = cents / 100
  const negative = cents < 0 ? '-' : ''
  const strDollars = negative + '$' + Math.abs(dollars).toFixed(2)
  return strDollars
}

interface SidebarProps {
  setAccount: (account: string | null) => void
}

function Sidebar({ setAccount }: SidebarProps) {
  const { user, isLoaded } = useUser()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const { accounts, getBalanceByAccount } = useBudgetStore()
  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getBalanceByAccount(account.name) ?? 0,
  }))
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const toggleAddAccountModal = () => {
    setShowAddAccountModal((prev) => !prev)
    console.log('toggleAddAccountModal')
  }
  const firstNameDisplay = isLoaded
    ? `${user?.firstName ?? user?.username}'s`
    : 'Your'

  return (
    <div className="flex h-screen w-[300px] flex-col items-start justify-start gap-2 bg-[#2c396a] px-2 py-4 font-sans font-light text-white">
      {/* Top card */}
      <div className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-md px-2 py-3 hover:bg-[#374D9B]">
        <Sprout className="h-[30px] w-[30px]" />
        <div className="flex flex-col">
          <div className="font-semibold">{firstNameDisplay} Budget</div>
          <div className="text-xs">
            {' '}
            {user?.emailAddresses[0].emailAddress ?? ''}{' '}
          </div>
        </div>
        <ChevronDown className="h-3 w-3" />
      </div>
      <div className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]">
        <Inbox />
        <div> Budget</div>
      </div>
      <div className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]">
        <ChartNoAxesCombined />
        <div> Reflect</div>
      </div>
      <div
        className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]"
        onClick={() => setAccount(null)}
      >
        <Landmark />
        <div> All Accounts</div>
      </div>
      {/* Budget box */}
      <div className="w-full">
        {/* Budget box header */}
        <button
          className="flex w-full justify-between rounded-md pr-2 text-[12px] text-xs"
          onClick={toggleDropdown}
        >
          <div className="flex flex-row items-center">
            <div className="h-3 w-5">
              {showDropdown ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
            <div> BUDGET </div>
          </div>
          <div className="text-xs">
            {' '}
            {formatCurrency(
              accountsWithBalance.reduce(
                (acc, account) => acc + account.balance,
                0
              )
            )}
          </div>
        </button>
        {/* Budget Accounts */}
        <div className="flex flex-col gap-1 py-2">
          {showDropdown &&
            accountsWithBalance.map((account, index) => (
              <div
                className="group flex cursor-pointer flex-row items-center rounded-md py-1 text-xs hover:bg-[#374D9B]"
                key={account.name}
                onClick={() => setAccount(account.name)}
              >
                <div className="flex h-3 w-6 flex-row items-center justify-start px-1 text-white opacity-50 hover:opacity-100">
                  <Pen
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
                      {formatCurrency(account.balance)}
                    </div>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <button
        className="flex w-[125px] flex-row items-center justify-center gap-2 rounded-lg bg-white bg-opacity-20 px-2 py-1 text-xs hover:bg-opacity-30"
        onClick={toggleAddAccountModal}
      >
        {' '}
        <CirclePlus className="h-3 w-3" /> Add Account{' '}
      </button>
      {showAddAccountModal && (
        <AddAccountModal toggleShowAccountModal={toggleAddAccountModal} />
      )}
    </div>
  )
}

export default Sidebar
