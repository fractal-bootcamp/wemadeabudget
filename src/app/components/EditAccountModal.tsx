import { X } from 'lucide-react'
import { AccountDetails } from '../types'
import { useState } from 'react'
import useBudgetStore, { useBudgetActions } from '../stores/transactionStore'
import {
  checkSubmittedName,
  METHODS,
  submitStatus,
  updateStoreAndDb,
} from '../util/utils'
import { dbAccountDelete, dbAccountUpdate } from '../actions/controller'

interface EditAccountModalProps {
  closeModal: () => void
  setCurrentAccount: (account: string | null) => void
  account: AccountDetails
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  closeModal,
  setCurrentAccount,
  account,
}) => {
  const accounts = useBudgetStore((state) => state.accounts)
  const { updateAccount, deleteAccount } = useBudgetActions()
  const [acctData, setAcctData] = useState<AccountDetails>(account)
  const [submitStatus, setSubmitStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })
  const resetErrorStatus = () => setSubmitStatus({ valid: true, message: '' })
  //add deleteaccount

  const handleSave = () => {
    const { valid, message } = checkSubmittedName(
      acctData.name,
      accounts.map((account) => account.name)
    )
    if (!valid) {
      setSubmitStatus({ valid, message })
      return
    }
    updateStoreAndDb({
      dbFunction: dbAccountUpdate,
      storeFunction: updateAccount,
      payload: { oldName: account.name, newDetails: acctData },
      method: METHODS.UPDATE,
    })
    setCurrentAccount(acctData.name)
    closeModal()
  }
  const handleDelete = () => {
    updateStoreAndDb({
      dbFunction: dbAccountDelete,
      storeFunction: deleteAccount,
      payload: account.name,
      method: METHODS.DELETE,
    })
    closeModal()
  }
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        closeModal()
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
            onClick={closeModal}
            className="absolute right-1 top-1 rounded-full p-1 text-black hover:bg-slate-200"
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
                {submitStatus.message}
              </div>
            )}
          </div>
        </form>
        <div className="flex justify-between border-t border-gray-400 p-4">
          <button
            className="rounded-md bg-red-100 px-3 py-1 font-normal text-red-700"
            type="button"
            onClick={handleDelete}
          >
            Delete Account
          </button>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-md bg-indigo-100 px-3 py-1 font-normal text-blue-600"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-blue-600 px-3 py-1 font-normal text-white"
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
