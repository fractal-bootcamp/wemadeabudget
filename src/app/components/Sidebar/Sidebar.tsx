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
  User,
  ChevronUp,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import AddAccountModal from '../AddAccountModal'
import EditAccountModal from '../EditAccountModal'
import { useUser } from '@clerk/nextjs'
import useBudgetStore, { useBudgetActions } from '../../stores/transactionStore'
import { formatCentsToDollarString } from '../../util/utils'
import { UserButton } from '@clerk/nextjs'
import { AccountDetails } from '../../types'
import SidebarAccount from './SidebarAccount'
import github from '../../../../public/github.svg'
import Image from 'next/image'
import AppInfo from '../AppInfo'
interface SidebarProps {
  setCurrentAccount: (account: string | null) => void
  setCurrentPage: (page: string) => void
}

function Sidebar({ setCurrentAccount, setCurrentPage }: SidebarProps) {
  const { user, isLoaded } = useUser()
  const [collapsed, setCollapsed] = useState(false) // hides the sidebar
  const [showBudgets, setShowBudgets] = useState(true)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountDetails | null>(
    null
  )
  //importing the transactions just to hook in for rerendering
  const transactions = useBudgetStore((state) => state.transactions)
  const accounts = useBudgetStore((state) => state.accounts)
  const { getBalanceByAccount } = useBudgetActions()
  const accountsWithBalance = accounts.map((account) => ({
    ...account,
    balance: getBalanceByAccount(account.name) ?? 0,
  }))
  const toggleDropdown = () => {
    setShowBudgets(!showBudgets)
  }

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown)
  }

  const toggleAddAccountModal = () => {
    setShowAddAccountModal((prev) => !prev)
  }

  const firstNameDisplay = isLoaded
    ? `${user?.firstName ?? user?.username}'s`
    : 'Your'

  const [isUserIconHovered, setIsUserIconHovered] = useState(false)

  return (
    <>
      {/* Underlay to close modal */}
      <div
        className={`@container relative flex h-screen transition-all duration-200 ${collapsed ? 'w-[75px]' : 'w-[300px]'} flex-col items-start justify-start gap-2 bg-[#2c396a] px-2 py-2 font-sans font-light text-white`}
      >
        {showUserDropdown && (
          <div
            className="absolute inset-0 z-30 h-full w-full bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              setShowUserDropdown(false)
            }}
          />
        )}
        {/* Top card */}
        <div className="relative">
          <div
            onClick={toggleUserDropdown}
            className={`flex w-full cursor-pointer flex-row items-center gap-2 rounded-md px-2 py-3 ${!showUserDropdown && 'hover:bg-[#374D9B]'}`}
          >
            <Sprout className="h-[30px] w-[30px]" />
            {!collapsed && (
              <div className="flex max-h-[30px] items-center">
                <div className="flex flex-col">
                  <div className="font-semibold">{firstNameDisplay} Budget</div>
                  <div className="text-xs">
                    {user?.emailAddresses[0].emailAddress ?? ''}
                  </div>
                </div>
                {showUserDropdown ? (
                  <ChevronUp size={20} strokeWidth={3} />
                ) : (
                  <ChevronDown size={20} strokeWidth={3} />
                )}
              </div>
            )}
          </div>
          {showUserDropdown && (
            <div
              className="absolute left-2 top-full z-50 rounded-md bg-white text-slate-800 shadow-2xl hover:text-slate-500"
              onMouseEnter={() => setIsUserIconHovered(true)}
              onMouseLeave={() => setIsUserIconHovered(false)}
            >
              <div className="relative">
                <div className="flex w-fit flex-row items-center justify-between gap-5 text-nowrap p-3 px-4">
                  <div className="shrink-0">
                    <User
                      size={20}
                      strokeWidth={2}
                      fill={isUserIconHovered ? 'gray' : 'black'}
                    />
                  </div>
                  {!collapsed && <div>Account</div>}
                </div>
                <div className="absolute inset-0 h-full w-full rounded-md bg-transparent">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonBox: 'hidden',
                        userButtonTrigger:
                          'absolute inset-0 rounded-none w-full h-full justify-end p-2 rounded-md bg-transparent',
                      },
                    }}
                  />
                </div>
              </div>
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
                    <SidebarAccount
                      key={account.name}
                      account={account}
                      setCurrentAccount={setCurrentAccount}
                      setEditingAccount={setEditingAccount}
                    />
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
        <div className="@[200px]:block absolute bottom-0 left-0 hidden w-[70%] overflow-hidden">
          <AppInfo colorMode="light" />
        </div>
      </div>
    </>
  )
}

export default Sidebar
