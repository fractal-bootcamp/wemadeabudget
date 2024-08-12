import { X } from 'lucide-react'
import {
  AccountDetails,
  AccountType,
  AccountTypeDetails,
  emptyAccount,
  startingBalanceTransaction,
  typeDetailsArray,
} from '../types'
import { useState } from 'react'
import useBudgetStore from '../stores/transactionStore'
import {
  checkSubmittedName,
  submitStatus,
  updateStoreAndDb,
} from '../util/utils'
import { dbAccountAdd, dbTransactionAdd } from '../actions/controller'
import { start } from 'repl'

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
        toggleShowAccountModal()
      }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-20 font-semibold text-black"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 flex w-[300px] flex-col rounded-xl bg-white text-sm shadow-2xl"
      >
        <div className="border-b border-gray-300 p-2">
          <h1 className="pb-4 text-center text-lg font-semibold">
            {' '}
            Add Account{' '}
          </h1>
          <button
            onClick={toggleShowAccountModal}
            className="absolute right-1 top-1 rounded-full p-1 text-black hover:bg-slate-200"
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
            {typeDetailsArray(AccountTypeDetails).map((acctType, index) => (
              <option
                key={acctData.type + index.toString()}
                value={acctType.type}
              >
                {acctType.display}
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
              const { valid, message } = checkSubmittedName(
                acctData.name,
                accounts.map((account) => account.name)
              )
              if (!valid) {
                setSubmitStatus({ valid, message })
                return
              }
              const initTransactionDetails = startingBalanceTransaction(
                acctData.name,
                parseFloat(initialBalanceDollarString) * 100
              )
              //add account and its initial balance to db and store
              updateStoreAndDb({
                dbFunction: dbAccountAdd,
                storeFunction: addAccount,
                payload: acctData,
                method: 'ADD',
              })
              updateStoreAndDb({
                dbFunction: dbTransactionAdd,
                storeFunction: addTransaction,
                payload: initTransactionDetails,
                method: 'ADD',
              })
              //
              //hide modal after submission
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
