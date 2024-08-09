import { X } from 'lucide-react'
import { AccountDetails, AccountType, emptyAccount } from '../types'
import { useState } from 'react'
import { accountAdd } from '../actions/controller'
import useBudgetStore from '../stores/transactionStore'

const ACCOUNT_TYPES: { label: string; value: AccountType }[] = [
  { label: 'Checking', value: 'CHECKING' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
]

const submitAccount = (
  acctData: AccountDetails,
  storeSetter: (data: AccountDetails) => void
) => {
  console.log(`Submitting account: ${JSON.stringify(acctData)}`)
  //send to db
  accountAdd(acctData).then((res) => {
    console.log(`Account added: ${JSON.stringify(res)}`)
  })
  //optimistic update to store
  storeSetter(acctData)
}
interface AddAccountModalProps {
  toggleShowAccountModal: () => void
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  toggleShowAccountModal,
}) => {
  const [acctData, setAcctData] = useState<AccountDetails>(emptyAccount)
  const { addAccount } = useBudgetStore()
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 font-semibold text-black">
      <div className="relative flex h-[400px] w-[300px] flex-col rounded bg-white text-sm shadow-2xl">
        <div className="border-b border-gray-300 p-2">
          <h1 className="pb-4 text-center text-lg font-semibold">
            {' '}
            Add Account{' '}
          </h1>
          <button
            onClick={toggleShowAccountModal}
            className="absolute right-3 top-3 text-indigo-700 hover:text-gray-800"
          >
            {' '}
            <X />
          </button>
        </div>
        <form className="flex flex-col gap-4 p-4">
          <label> Let's go!</label>
          <label> Give it a nickname</label>
          <input
            className="border-gray-300px-2 rounded border px-2 py-1"
            type="text"
            placeholder="Account Name"
            value={acctData.name}
            onChange={(e) => setAcctData({ ...acctData, name: e.target.value })}
          />
          <label htmlFor="accountType">
            What type of account are you adding?
          </label>
          <select
            id="accountType"
            name="accountType"
            className="rounded border border-gray-300 px-2 py-1"
            value={acctData.type}
            onChange={(e) =>
              setAcctData({ ...acctData, type: e.target.value as AccountType })
            }
          >
            {ACCOUNT_TYPES.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <label>What is your current account balance?</label>
          <input
            className="rounded border border-gray-400 px-2 py-1"
            type="text"
            placeholder="Balance"
          />
        </form>
        <div className="flex justify-center border-t border-gray-400 p-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            //TODO: add an initial balance transaction based on the blaance input
            onClick={() => {
              submitAccount(acctData, addAccount)
              toggleShowAccountModal()
            }}
          >
            {' '}
            Add Account{' '}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAccountModal
