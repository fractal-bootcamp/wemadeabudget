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

const accounts = [
  { name: 'Checking', balance: 1000 },
  { name: 'Savings', balance: 2000 },
  { name: 'Credit Card', balance: -500 },
]

function Sidebar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const toggleAddAccountModal = () => {
    setShowAddAccountModal((prev) => !prev)
    console.log('toggleAddAccountModal')
  }

  return (
    <div className="flex h-screen w-[300px] flex-col gap-4 bg-[#2c396a] pt-4 font-sans font-light text-white">
      <div className="mx-2 flex flex-row items-center gap-2 rounded-md p-2 hover:bg-[#374D9B]">
        <Sprout className="h-[30px] w-[30px]" />
        <div className="flex flex-col">
          <div className="font-semibold"> sarah's Budget</div>
          <div className="text-xs"> sarahebicknell@gmail.com </div>
        </div>
        <ChevronDown className="h-3 w-3" />
      </div>
      <div className="mx-2 flex flex-row gap-3 rounded-md p-2 hover:bg-[#374D9B]">
        <Inbox />
        <div> Budget</div>
      </div>
      <div className="mx-2 flex flex-row gap-3 rounded-md p-2 hover:bg-[#374D9B]">
        <ChartNoAxesCombined />
        <div> Reflect</div>
      </div>
      <div className="mx-2 flex flex-row gap-3 rounded-md p-2 hover:bg-[#374D9B]">
        <Landmark />
        <div> All Accounts</div>
      </div>
      <div>
        <button
          className="flex- flex w-full justify-between rounded-md p-2 text-[12px] text-xs"
          onClick={toggleDropdown}
        >
          <div className="flex flex-row items-center gap-2">
            {showDropdown ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <div> BUDGET </div>
          </div>
          <div className="pr-6"> $baltotal</div>
        </button>
        {showDropdown &&
          accounts.map((account, index) => (
            <div
              className="ml-2 mr-2 flex flex-row rounded-md py-1 text-xs hover:bg-[#374D9B]"
              key={index}
            >
              <div className="group relative flex w-full flex-row justify-between pr-6 text-xs">
                <Pen className="absolute left-2 top-1/2 mr-2 hidden h-3 w-3 -translate-y-1/2 transform group-hover:block" />
                <button className="flex w-full flex-row justify-between pl-7 text-xs">
                  <div> {account.name} </div>
                  <div
                    className="flex px-1"
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
                    {account.balance > 0 ? '$' : '-$'}{' '}
                    {account.balance > 0
                      ? account.balance
                      : account.balance.toString().slice(1)}
                  </div>
                </button>
              </div>
            </div>
          ))}
      </div>
      <button
        className="ml-4 flex w-[150px] flex-row items-center justify-center gap-2 rounded-lg bg-white bg-opacity-20 p-2 text-xs hover:bg-opacity-30"
        onClick={toggleAddAccountModal}
      >
        {' '}
        <CirclePlus className="h-3 w-3" /> Add Account{' '}
      </button>
      {showAddAccountModal && (
        <AddAccountModal toggle={toggleAddAccountModal} />
      )}
    </div>
  )
}

export default Sidebar
