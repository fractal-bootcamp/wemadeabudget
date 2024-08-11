import { X } from 'lucide-react'
import {
  AccountDetails,
  AccountType,
  emptyAccount,
  TransactionDetails,
} from '../types'
import { useState } from 'react'
import { accountAdd, transactionAdd } from '../actions/controller'
import useBudgetStore from '../stores/transactionStore'

const ACCOUNT_TYPES: { label: string; value: AccountType }[] = [
  { label: 'Checking', value: 'CHECKING' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
]

interface submitStatus {
  valid: boolean
  message: string
}
const checkNewAccountSubmit = (
  name: string,
  existingNames: string[]
): submitStatus => {
  if (name.length === 0) {
    return { valid: false, message: 'Account name must not be blank' }
  }
  if (name.trim().length === 0) {
    return { valid: false, message: 'Name cannot be only spaces' }
  }
  if (existingNames.some((existingName) => existingName === name)) {
    return { valid: false, message: 'Account with that name already exists' }
  }
  return { valid: true, message: '' }
}

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
  //TODO: verify and sync store after db call response
}
const submitInitialBalance = (
  amount: number,
  newAccountName: string,
  storeAdder: (details: TransactionDetails) => void
) => {
  const transactionDetails: TransactionDetails = {
    id: '',
    account: newAccountName,
    category: 'Ready To Assign',
    payee: 'Starting Balance',
    date: new Date(),
    cents: amount,
    memo: 'Account starting balance (entered automatically)',
    flag: 'NONE',
    cleared: true,
  }
  storeAdder(transactionDetails)
  transactionAdd(transactionDetails).then((transactionDbRes) => {
    console.log(
      `Initial transaction added: ${JSON.stringify(transactionDbRes)}`
    )
  })
}
interface AddAccountModalProps {
  toggleShowAccountModal: () => void
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  toggleShowAccountModal,
}) => {
  const [acctData, setAcctData] = useState<AccountDetails>(emptyAccount)
  const [initialBalanceDollarString, setInitialBalanceDollarString] =
    useState('0')
  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })
  const resetErrorStatus = () => setSubmitStatus({ valid: true, message: '' })
  const { addAccount, addTransaction, accounts } = useBudgetStore()
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-20 font-semibold text-black"
    >
      <div className="relative z-50 flex w-[300px] flex-col rounded-xl bg-white text-sm shadow-2xl">
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
          <label> Let&apos;s go!</label>
          <label> Give it a nickname</label>
          <div className="flex flex-col">
            <input
              className={`${submitStatus.valid ? 'rounded-b border-gray-300' : 'rounded-t border-red-300'} border px-2 py-1`}
              type="text"
              placeholder="Account Name"
              value={acctData.name}
              onFocus={resetErrorStatus}
              onChange={(e) => {
                setAcctData({ ...acctData, name: e.target.value })
                resetErrorStatus()
              }}
            />
            {/* Error message */}
            {!submitStatus.valid && (
              <div className="rounded-b bg-red-300 p-2 font-normal text-black">
                {submitStatus.message}
              </div>
            )}
          </div>
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
            type="number"
            step="0.01"
            placeholder="Balance"
            value={initialBalanceDollarString}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100)
              setInitialBalanceDollarString((cents / 100).toString())
            }}
          />
        </form>
        <div className="flex justify-center border-t border-gray-400 p-4">
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            onClick={() => {
              const { valid, message } = checkNewAccountSubmit(
                acctData.name,
                accounts.map((account) => account.name)
              )
              if (!valid) {
                setSubmitStatus({ valid, message })
                return
              }
              submitAccount(acctData, addAccount)
              submitInitialBalance(
                parseFloat(initialBalanceDollarString) * 100,
                acctData.name,
                addTransaction
              )
              toggleShowAccountModal()
            }}
          >
            Add Account{' '}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAccountModal
