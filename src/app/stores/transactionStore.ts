import { User } from '@clerk/nextjs/server'
import { create } from 'zustand'
import {
  AccountDetails,
  TransactionDetails,
  CategoryDetails,
  CategoryUpdatePayload,
  AccountUpdatePayload,
  PayeeUpdatePayload,
  PayeeDetails,
  extractTransferAccount,
  accountTransferPayee,
} from '../types'
import { Category } from '@prisma/client'
type DbPopulationPayload = {
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  payees: PayeeDetails[]
  categories: CategoryDetails[]
}
type budgetStore = {
  loaded: boolean
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  payees: PayeeDetails[]
  categories: CategoryDetails[]
  /** Retrieves the entire transaction array */
  actions: {
    populateStoreFromDb: (dbData: DbPopulationPayload) => void
    getAllTransactions: () => TransactionDetails[]
    /** Sets the loaded state to true */
    load: () => void
    /** Checks if the store is loaded */
    isLoaded: () => boolean
    /** Sums up all transactions for a given account */
    getBalanceByAccount: (accountName: string) => number
    /** Sums up all transactions for a given category */
    getBalanceByCategory: (categoryName: string) => number
    /**Gets a transaction by its ID */
    getTransactionById: (transactionId: string) => TransactionDetails
    /** Retrieves all transactions for a given account */
    getTransactionsByAccount: (accountName: string) => TransactionDetails[]
    /** Retrieves all transactions for a given payee */
    getTransactionsByPayee: (payeeName: string) => TransactionDetails[]
    /** Retrieves all transactions for a given category */
    getTransactionsByCategory: (categoryName: string) => TransactionDetails[]
    /** Sums up the amounts from every transaction */
    netBalanceCents: () => number
    /** Sums up all allocated amounts in every category */
    totalAssigned: () => number
    /** Adds a new account to the store */
    addAccount: (account: AccountDetails) => void
    /** Removes an account from the store by its name */
    deleteAccount: (accountName: string) => void
    /** Updates an existing account in the store */
    updateAccount: (accountUpdatePayload: AccountUpdatePayload) => void
    /** Adds a new transaction to the store */
    addTransaction: (transaction: TransactionDetails) => void
    /** Adds a new transfer to the store */
    addTransfer: (transaction: TransactionDetails) => void
    /** Removes a transaction from the store by its ID */
    deleteTransaction: (transactionId: string) => void
    /** Updates an existing transaction in the store */
    updateTransaction: (newDetails: TransactionDetails) => void
    /** Updates an existing transfer in the store */
    updateTransfer: (newDetails: TransactionDetails) => void
    /** Adds a new payee to the store */
    addPayee: (payee: PayeeDetails) => void
    /** Removes a payee from the store */
    removePayee: (payee: string) => void
    /** Updates an existing payee in the store */
    updatePayeeName: (payeeUpdatePayload: PayeeUpdatePayload) => void
    /** Adds a new category to the store */
    addCategory: (category: CategoryDetails) => void
    /** Deletes a category from the store by its name, moving its transactions to "Uncategorized" (unless it is permanent) */
    deleteCategory: (categoryName: string) => void
    /** Edits an existing category in the store identified by its old name */
    updateCategory: (categoryUpdatePayload: CategoryUpdatePayload) => void
  }
}

const useBudgetStore = create<budgetStore>((set, get) => ({
  loaded: false,
  transactions: [],
  accounts: [],
  payees: [],
  categories: [],
  actions: {
    populateStoreFromDb: (dbData) => {
      set((state) => ({
        transactions: dbData.transactions,
        accounts: dbData.accounts,
        payees: dbData.payees,
        categories: dbData.categories,
      }))
    },
    getAllTransactions: () => get().transactions,
    load: () => {
      set((state) => ({
        loaded: true,
      }))
    },
    isLoaded: () => get().loaded,
    getTransactionById: (transactionId) => {
      const transaction = get().transactions.find(
        (transaction) => transaction.id === transactionId
      )
      if (!transaction) throw new Error('Transaction not found')
      return transaction
    },
    /**Sums up all transactions for a given account */
    getBalanceByAccount: (accountName) =>
      get()
        .actions.getTransactionsByAccount(accountName)
        .reduce((acc, transaction) => acc + transaction.cents, 0),
    /**Sums up all transactions for a given category */
    getBalanceByCategory: (categoryName) =>
      get()
        .actions.getTransactionsByCategory(categoryName)
        .reduce((acc, transaction) => acc + transaction.cents, 0),
    getTransactionsByAccount: (accountName) =>
      get().transactions.filter(
        (transaction) => transaction.account === accountName
      ),
    getTransactionsByPayee: (payeeName) =>
      get().transactions.filter(
        (transaction) => transaction.payee === payeeName
      ),
    getTransactionsByCategory: (categoryName) =>
      get().transactions.filter(
        (transaction) => transaction.category === categoryName
      ),
    /**Sums up the amounts from every transaction */
    netBalanceCents: () =>
      get().transactions.reduce(
        (acc, transaction) => acc + transaction.cents,
        0
      ),
    /**Sums up all allocated amounts in every category */
    totalAssigned: () =>
      get().categories.reduce((acc, category) => acc + category.allocated, 0),

    addAccount: (account) => {
      //add the transfer payee
      get().actions.addPayee(accountTransferPayee(account.name))
      set((state) => ({
        accounts: [...state.accounts, account],
      }))
    },
    deleteAccount: (accountName) =>
      set((state) => ({
        //remove the transfer payee for this account
        payees: state.payees.filter(
          (payee) => payee.name !== accountTransferPayee(accountName).name
        ),
        accounts: state.accounts.filter(
          (account) => account.name !== accountName
        ),
        //cascade remove the account's transactions and any transfers to/from it
        transactions: state.transactions.filter(
          (transaction) =>
            transaction.account !== accountName &&
            transaction.payee !== accountTransferPayee(accountName).name
        ),
      })),
    updateAccount: (accountUpdatePayload) =>
      //upate the transfer payee name
      {
        get().actions.updatePayeeName({
          oldName: accountTransferPayee(accountUpdatePayload.oldName).name,
          newName: accountTransferPayee(accountUpdatePayload.newDetails.name)
            .name,
        })
        set((state) => ({
          accounts: state.accounts.map((account) => {
            if (account.name === accountUpdatePayload.oldName) {
              return accountUpdatePayload.newDetails
            }
            return account
          }),
        }))
      },
    addTransaction: (transaction) =>
      set((state) => ({
        transactions: [...state.transactions, transaction],
      })),
    addTransfer: (transaction) => {
      //create a corresponding transfer transaction in the target/source account
      const otherAccount = extractTransferAccount(transaction.payee)
      if (!get().accounts.find((account) => account.name === otherAccount)) {
        throw new Error('Transfer account not found')
      }
      const transferTransaction = {
        ...transaction,
        payee: `Transfer to/from: ${transaction.account}`,
        account: otherAccount,
        cents: -transaction.cents,
        transfer: true,
      }
      set((state) => ({
        transactions: [...state.transactions, transaction, transferTransaction],
      }))
    },
    deleteTransaction: (transactionId) => {
      //if the transaction is a transfer, delete the paired transfer as well
      const transaction = get().transactions.find(
        (transaction) => transaction.id === transactionId
      )
      if (!transaction) throw new Error('Transaction not found')
      const pairedTransferId = transaction.pairedTransferId
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) =>
            transaction.id !== transactionId &&
            transaction.id !== pairedTransferId
        ),
      }))
    },
    updateTransaction: (updatedTransactionDetails) => {
      const existingTransaction = get().transactions.find(
        (transaction) => transaction.id === updatedTransactionDetails.id
      )
      if (!existingTransaction)
        throw new Error('Transaction to be updated was not found')
      //if the transactions is not being updated to be a transfer, just update
      if (!updatedTransactionDetails.transfer)
        set((state) => ({
          transactions: state.transactions.map((transaction) => {
            if (transaction.id === updatedTransactionDetails.id) {
              return updatedTransactionDetails
            }
            return transaction
          }),
        }))
      //otherwise, we are updating a transaction to BECOME a transfer
      else {
        //if the existing transaction IS a transfer, we should have called updateTransfer in the first place, but do so now
        if (existingTransaction.transfer)
          get().actions.updateTransfer(updatedTransactionDetails)
        //if not, we are making a new transfer
        else {
        }
      }
    },
    updateTransfer: (updatedTransactionDetails) => {
      const existingPairedTransfer = get().transactions.find(
        (transaction) =>
          transaction.id === updatedTransactionDetails.pairedTransferId
      )
      if (!existingPairedTransfer) throw new Error(`Paired transfer not found `)
      //delete the existing pair of transfer transactions and make a new pair
      get().actions.deleteTransaction(existingPairedTransfer.id)
      get().actions.deleteTransaction(updatedTransactionDetails.id)
      get().actions.addTransfer(updatedTransactionDetails)
    },
    addPayee: (payee) =>
      set((state) => ({
        payees: [...state.payees, payee],
      })),
    removePayee: (payee) =>
      set((state) => ({
        payees: state.payees.filter((p) => p.name !== payee),
      })),
    updatePayeeName: (payeeUpdatePayload) =>
      set((state) => ({
        payees: state.payees.map((payee) => {
          if (payee.name === payeeUpdatePayload.oldName) {
            return { ...payee, name: payeeUpdatePayload.newName }
          }
          return payee
        }),
      })),
    addCategory: (category) =>
      set((state) => {
        console.log(category.name)
        if (state.categories.find((c) => c.name === category.name)) {
          throw new Error('Category already exists: ' + category.name)
        }
        return { categories: [...state.categories, category] }
      }),
    deleteCategory: (categoryName) =>
      set((state) => {
        //If category is permanent, throw an error
        const category = state.categories.find((c) => c.name === categoryName)
        if (category?.permanent) {
          throw new Error('Cannot delete a permanent category.')
        }
        ///otherwise, move all transactions in the category to the Uncategorized category then delete the category
        return {
          categories: state.categories.filter(
            (category) => category.name !== categoryName
          ),
          transactions: state.transactions.map((transaction) => {
            if (transaction.category === categoryName) {
              return { ...transaction, category: 'Uncategorized' }
            }
            return transaction
          }),
        }
      }),
    updateCategory: (categoryUpdatePayload) => {
      set((state) => ({
        categories: state.categories.map((category) => {
          if (category.name === categoryUpdatePayload.oldName) {
            return categoryUpdatePayload.newDetails
          }
          return category
        }),
      }))
    },
  },
}))

export default useBudgetStore
export const useBudgetActions = () => useBudgetStore((state) => state.actions)
