'use client'
import {
  CategoryDetails,
  emptyTransaction,
  PayeeDetails,
  TransactionDetails,
} from '../../types'
import FlagToggle from './Flag/FlagToggle'
import ClearedButton from './ClearedButton'
import { useState, useEffect } from 'react'
import useBudgetStore, { useBudgetActions } from '../../stores/transactionStore'
import Dropdown from '../Dropdown/Dropdown'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ChevronDown, CircleAlert } from 'lucide-react'
import { METHODS, submitStatus, updateStoreAndDb } from '../../util/utils'
import {
  dbCategoryAdd,
  dbPayeeAdd,
  dbTransactionAdd,
  dbTransactionAddTransfer,
  dbTransactionUpdate,
  dbTransactionUpdateTransfer,
} from '../../actions/controller'

type TransactionFormProps = {
  columnWidths: { [key: string]: number }
  showAccount: boolean
  closeFunction: () => void
  existingTransaction?: TransactionDetails
  accountName?: string
}
const validateTransactionSubmission = (
  newTransaction: TransactionDetails
): submitStatus => {
  if (newTransaction.account === '') {
    return { valid: false, message: 'Account is required' }
  }
  if (newTransaction.date === null) {
    return { valid: false, message: 'Date is required' }
  }
  if (newTransaction.payee === '') {
    return { valid: false, message: 'Payee is required' }
  }
  if (newTransaction.category === '') {
    return { valid: false, message: 'Category is required' }
  }
  return { valid: true, message: '' }
}
function TransactionForm({
  columnWidths,
  showAccount,
  closeFunction,
  existingTransaction,
  accountName,
}: TransactionFormProps) {
  const accounts = useBudgetStore((state) => state.accounts)
  const payees = useBudgetStore((state) => state.payees)
  const categories = useBudgetStore((state) => state.categories)
  const {
    addCategory,
    addPayee,
    addTransaction,
    updateTransaction,
    addTransfer,
    updateTransfer,
  } = useBudgetActions()
  const [formData, setFormData] = useState<TransactionDetails>(
    existingTransaction || { ...emptyTransaction, account: accountName || '' }
  )
  const [errorStatus, setErrorStatus] = useState<submitStatus>({
    valid: true,
    message: '',
  })
  const [inflow, setInflow] = useState(
    formData.cents > 0 ? formData.cents / 100 : 0
  )
  const [outflow, setOutflow] = useState(
    formData.cents < 0 ? Math.abs(formData.cents) / 100 : 0
  )
  const { dbFunc, storeFunc } = (() => {
    switch (true) {
      //if there is a preexisting transaction and this is a transfer, update the transfer
      case existingTransaction && formData.transfer:
        return {
          dbFunc: dbTransactionUpdateTransfer,
          storeFunc: updateTransfer,
        }
      //if there is a preexisting transaction and this isnt a transfer, update the transaction
      case existingTransaction && !formData.transfer:
        return {
          dbFunc: dbTransactionUpdate,
          storeFunc: updateTransaction,
        }
      //if there is no preexisting transaction and this is a transfer, add the transfer
      case !existingTransaction && formData.transfer:
        return {
          dbFunc: dbTransactionAddTransfer,
          storeFunc: addTransfer,
        }
      //if there is no preexisting transaction and this isnt a transfer, add the transaction
      default:
        return {
          dbFunc: dbTransactionAdd,
          storeFunc: addTransaction,
        }
    }
  })()
  const handleTransactionSubmit = (formData: TransactionDetails) => {
    const status = validateTransactionSubmission(formData)
    if (!status.valid) {
      setErrorStatus(status)
      return false
    }
    updateStoreAndDb({
      dbFunction: dbFunc,
      storeFunction: storeFunc,
      payload: formData,
      method: existingTransaction ? METHODS.UPDATE : METHODS.ADD,
    })
    return true
  }
  const resetForm = () => {
    setFormData({ ...emptyTransaction, account: accountName || '' })
    setInflow(0)
    setOutflow(0)
    setErrorStatus({ valid: true, message: '' })
  }

  const handleSave = (formData: TransactionDetails) => {
    if (!handleTransactionSubmit(formData)) return //abort resetting/closing if submit fails validation
    closeFunction()
  }

  const handleSaveAndAddAnother = (formData: TransactionDetails) => {
    if (!handleTransactionSubmit(formData)) return //abort resetting/closing if submit fails validation
    resetForm()
  }

  const handleCancel = () => {
    closeFunction()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (!existingTransaction) {
          handleSaveAndAddAnother(formData)
        } else {
          handleSave(formData)
        }
      } else if (event.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [formData, existingTransaction])

  return (
    <div
      className="flex flex-col gap-1 bg-indigo-100 px-0 py-2 text-xs"
      onClick={() => setErrorStatus({ valid: true, message: '' })}
    >
      {/* Details/edit fields */}
      <div className="flex flex-row gap-0 px-1">
        {/* dummy always selected checkbox */}
        <div
          className="flex items-center justify-center px-1"
          style={{ width: columnWidths.checkbox }}
        >
          <input
            type="checkbox"
            readOnly
            className="pointer-events-none rounded"
            checked={true}
          />
        </div>
        {/* Flag */}
        <div
          className="flex items-center justify-center px-1"
          style={{ width: columnWidths.flag }}
        >
          <FlagToggle
            currentFlag={formData.flag}
            onFlagSelect={(flag) => setFormData({ ...formData, flag })}
          />
        </div>
        {showAccount && (
          <div
            style={{ width: columnWidths.account }}
            className="flex w-full items-center truncate px-1 text-xs"
          >
            <Dropdown
              options={accounts.map((account) => account.name)}
              selected={formData.account}
              label="Account"
              setSelected={(selection: string) => {
                setFormData({ ...formData, account: selection })
              }}
            />
          </div>
        )}
        <div
          style={{ width: columnWidths.date }}
          className="flex items-center px-1 text-xs"
        >
          <DatePicker
            selected={formData.date}
            onChange={(date: Date | null) =>
              setFormData({ ...formData, date: date || new Date() })
            }
            dateFormat="MM-dd-yyyy"
            customInput={
              <div className="relative">
                <input
                  value={
                    formData.date
                      ? formData.date.toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : ''
                  }
                  readOnly
                  className={`${formData.date ? 'text-black' : 'text-gray-400'} flex w-full items-center justify-between rounded-md border border-blue-700 bg-white px-2 py-1`}
                  style={{ width: '100%', maxWidth: '150px' }}
                />
                <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            }
          />
        </div>
        <div
          style={{ width: columnWidths.payee }}
          className="flex items-center truncate px-1 text-xs"
        >
          <Dropdown
            options={payees.map((payee) => payee.name)}
            selected={formData.payee}
            addOptions={true}
            label="Payee"
            addOptionCallback={(newPayeeName: string) => {
              const payload: PayeeDetails = {
                name: newPayeeName,
                accountTransfer: false,
              }
              updateStoreAndDb({
                dbFunction: dbPayeeAdd,
                storeFunction: addPayee,
                payload: payload,
                method: 'ADD',
              })
              setFormData({ ...formData, payee: newPayeeName })
            }}
            setSelected={(selection: string) => {
              const payeeDetails = payees.find(
                (payee) => payee.name === selection
              )
              if (!payeeDetails) throw new Error('Payee not found')
              setFormData({
                ...formData,
                payee: selection,
                transfer: payeeDetails.accountTransfer,
              })
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.category }}
          className="flex items-center truncate px-1 text-xs"
        >
          <Dropdown
            options={categories
              .map((category) => category.name)
              .filter((category) => category !== 'Uncategorized')}
            selected={formData.category}
            label="Category"
            addOptions={true}
            addOptionCallback={(newCategoryName: string) => {
              const payload: CategoryDetails = {
                name: newCategoryName,
                allocated: 0,
                permanent: false,
              }
              updateStoreAndDb({
                dbFunction: dbCategoryAdd,
                storeFunction: addCategory,
                payload,
                method: 'ADD',
              })
              setFormData({ ...formData, category: newCategoryName })
            }}
            setSelected={(selection: string) => {
              setFormData({ ...formData, category: selection })
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.memo }}
          className="flex items-center truncate px-1 text-xs"
        >
          <input
            type="text"
            name="memo"
            placeholder="Memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className={`${formData.memo.length === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-between rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2`}
          />
        </div>
        <div
          style={{ width: columnWidths.outflow }}
          className="flex items-center justify-end truncate px-1 text-xs"
        >
          <input
            type="number"
            name="outflow"
            step="0.01"
            placeholder="Outflow"
            className={`${outflow === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-end rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2 text-right`}
            value={outflow || ''}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100) || 0

              setInflow(0)
              setFormData({
                ...formData,
                cents: -cents,
              })
              setOutflow(cents / 100)
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.inflow }}
          className="flex items-center justify-end truncate px-1 text-xs"
        >
          <input
            type="number"
            name="inflow"
            placeholder="Inflow"
            className={`${inflow === 0 ? 'text-gray-400' : 'text-black'} flex w-full items-center justify-end rounded-md border border-blue-700 bg-white py-1 pl-2 pr-2 text-right`}
            value={inflow || ''}
            onChange={(e) => {
              const cents = Math.floor(parseFloat(e.target.value) * 100) || 0
              setOutflow(0)
              setFormData({
                ...formData,
                cents: cents,
              })
              setInflow(cents / 100)
            }}
          />
        </div>
        <div
          style={{ width: columnWidths.cleared }}
          className="flex items-center justify-center px-1"
        >
          <ClearedButton
            cleared={formData.cleared}
            onToggle={() =>
              setFormData({ ...formData, cleared: !formData.cleared })
            }
          />
        </div>
      </div>
      {/* Buttons */}
      <div
        className="flex flex-row justify-end gap-2 self-end"
        style={{ marginRight: `${columnWidths.cleared}px` }}
      >
        {!errorStatus.valid && (
          <div className="flex items-center justify-center gap-1 rounded bg-red-300 px-2 text-sm text-black">
            <CircleAlert size={18} />
            {errorStatus.message}
          </div>
        )}
        <button
          className="rounded-lg border border-indigo-600 px-4 py-1 text-indigo-600 hover:bg-blue-700 hover:text-white"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleCancel()
          }}
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation()
            handleSave(formData)
          }}
        >
          Save{' '}
        </button>
        {!existingTransaction && (
          <button
            className="rounded-lg bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation()
              handleSaveAndAddAnother(formData)
            }}
          >
            Save and Add Another{' '}
          </button>
        )}
      </div>
    </div>
  )
}

export default TransactionForm
