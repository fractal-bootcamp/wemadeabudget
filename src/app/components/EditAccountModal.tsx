import { X } from 'lucide-react'
import {
  AccountDetails,
  AccountType,
  emptyAccount,
  TransactionDetails,
} from '../types'
import { useState, useEffect} from 'react'
// import { accountUpdate} from '../actions/controller'
import useBudgetStore from '../stores/transactionStore'


interface submitStatus {
  valid: boolean
  message: string
}
const checkEditAccountSubmit = (
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


interface EditAccountModalProps {
  toggleEditAccountModal: (accountName: string | null) => void
  accountName: string | null
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  toggleEditAccountModal, accountName
}) => {
  const [acctData, setAcctData] = useState<AccountDetails>(emptyAccount)
  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })
  const resetErrorStatus = () => setSubmitStatus({ valid: true, message: '' })
  const { accounts, updateAccount} = useBudgetStore()
  //add deleteaccount

  useEffect(() => {
    const account = accounts.find(acc => acc.name === accountName)
    if (account) {
      setAcctData(account)
    }
  }, [accountName, accounts])

  if (!acctData) return null


  const handleSave = () => {
    const { valid, message } = checkEditAccountSubmit(
      acctData.name,
      accounts.filter(acc => acc.name !== accountName).map(acc => acc.name)
    )
    if (!valid) {
      setSubmitStatus({ valid, message })
      return
    }
    updateAccount({
        oldName: accountName!,
        newDetails: acctData
      })
    toggleEditAccountModal(null)
  }

  const handleDelete = () => {
    console.log('delete')
    toggleEditAccountModal(null)
  }


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
            Edit Account{' '}
          </h1>
          <button
            onClick={() => toggleEditAccountModal(null)}
            className="absolute right-3 top-3 text-indigo-700 hover:text-gray-800"
          >
            {' '}
            <X />
          </button>
        </div>
        <form className="flex flex-col gap-4 p-4">
          <label> Account nickname</label>
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
                {!submitStatus.valid && (
              <div className="rounded-b bg-red-300 p-2 font-normal text-black">
                {submitStatus.message}</div>
            )}
            </div>
        
        </form>
        <div className="flex justify-between border-t border-gray-400 p-4">
            <button
              className="rounded-md font-normal px-3 py-1 bg-red-100 text-red-700"
              type="button"
              onClick={handleDelete}
            >
              Delete Account
            </button>
            <div className= "flex justify-end gap-2">
                <button
                className="rounded-md font-normal px-3 py-1 bg-indigo-100 text-blue-600"
                type="button"
                onClick={() => toggleEditAccountModal(null)}
                >
                Cancel
                </button>
                <button
                className="rounded-md font-normal bg-blue-600 px-3 py-1 text-white"
                onClick={handleSave}
                >
                Save{' '}
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default EditAccountModal
