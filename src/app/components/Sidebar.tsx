import {
  Sprout,
  Landmark,
  Inbox,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Pen,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react'
import { useState } from 'react'
import AddAccountModal from './AddAccountModal'
import EditAccountModal from './EditAccountModal'
import { useUser } from '@clerk/nextjs'
import useBudgetStore from '../stores/transactionStore'
import { formatCentsToDollarString } from '../util/utils'
import { AccountDetails } from '../types'

interface SidebarProps {
  setCurrentAccount: (account: string | null) => void
  setCurrentPage: (page: string) => void
}

function Sidebar({ setCurrentAccount, setCurrentPage }: SidebarProps) {
  const { user, isLoaded } = useUser()
  const [collapsed, setCollapsed] = useState(false) // hides the sidebar
  const [showBudgets, setShowBudgets] = useState(false)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountDetails | null>(
    null
  )
  const { accounts, getBalanceByAccount } = useBudgetStore()
  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getBalanceByAccount(account.name) ?? 0,
  }))
  const toggleDropdown = () => {
    setShowBudgets(!showBudgets)
  }

  const toggleAddAccountModal = () => {
    setShowAddAccountModal((prev) => !prev)
    console.log('toggleAddAccountModal')
  }

  const firstNameDisplay = isLoaded
    ? `${user?.firstName ?? user?.username}'s`
    : 'Your'

  return (
    <div
      className={`relative flex h-screen transition-all duration-200 ${collapsed ? 'w-[75px]' : 'w-[300px]'} flex-col items-start justify-start gap-2 bg-[#2c396a] px-2 py-2 font-sans font-light text-white`}
    >
      {/* Top card */}
      <div className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-md px-2 py-3 hover:bg-[#374D9B]">
        <Sprout className="h-[30px] w-[30px]" />
        {!collapsed && (
          <div className="flex max-h-[30px] items-center">
            <div className="flex flex-col">
              <div className="font-semibold">{firstNameDisplay} Budget</div>
              <div className="text-xs">
                {' '}
                {user?.emailAddresses[0].emailAddress ?? ''}{' '}
              </div>
            </div>

            <ChevronDown size={20} strokeWidth={3} />
          </div>
        )}
      </div>
      <div
        onClick={() => setCurrentPage('budget')}
        className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]"
      >
        <Inbox />
        {!collapsed && <div> Budget</div>}
      </div>
      <div
        onClick={() => setCurrentPage('reflect')}
        className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]"
      >
        <ChartNoAxesCombined />
        {!collapsed && <div> Reflect</div>}
      </div>
      <div
        className="flex w-full cursor-pointer flex-row gap-3 rounded-md px-2 py-3 hover:bg-[#374D9B]"
        onClick={() => setCurrentAccount(null)}
      >
        <Landmark />
        {!collapsed && <div> All Accounts</div>}
      </div>
      {!collapsed && (
        <div className="w-full">
          {/* Budget box */}
          <div className="w-full">
            {/* Budget box header */}
            <button
              className="flex w-full justify-between rounded-md pr-2 text-[12px] text-xs"
              onClick={toggleDropdown}
            >
              <div className="flex flex-row items-center">
                <div className="h-3 w-5">
                  {showBudgets ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                <div> BUDGET </div>
              </div>
              <div className="text-xs">
                {' '}
                {formatCentsToDollarString(
                  accountsWithBalance.reduce(
                    (acc, account) => acc + account.balance,
                    0
                  )
                )}
              </div>
            </button>
            {/* Budget Accounts */}
            <div className="flex flex-col gap-1 py-2">
              {showBudgets &&
                accountsWithBalance.map((account, index) => (
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
                ))}
            </div>
          </div>
          {/* Add Account button */}
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
          {editingAccount && (
            <EditAccountModal
              closeModal={() => setEditingAccount(null)}
              setCurrentAccount={setCurrentAccount}
              account={editingAccount}
            />
          )}
        </div>
      )}
      <div
        className="absolute bottom-0 right-0 cursor-pointer p-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <PanelLeftOpen size={28} strokeWidth={1.5} />
        ) : (
          <PanelLeftClose size={28} strokeWidth={1.5} />
        )}
      </div>
    </div>
  )
}

export default Sidebar
