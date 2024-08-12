import { User } from '@clerk/nextjs/server'
import { create } from 'zustand'
import {
  AccountDetails,
  TransactionDetails,
  CategoryDetails,
  Category,
} from '../types'

type budgetStore = {
  loaded: boolean
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  payees: string[]
  categories: CategoryDetails[]
  /** Retrieves the entire transaction array */
  getAllTransactions: () => TransactionDetails[]
  /** Sets the loaded state to true */
  load: () => void
  /** Checks if the store is loaded */
  isLoaded: () => boolean
  /** Sums up all transactions for a given account */
  getBalanceByAccount: (accountName: string) => number
  /** Sums up all transactions for a given category */
  getBalanceByCategory: (categoryName: string) => number
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
  /** Removes a transaction from the store by its ID */
  removeTransaction: (transactionId: string) => void
  /** Updates an existing transaction in the store */
  updateTransaction: (newDetails: TransactionDetails) => void
  /** Adds a new payee to the store */
  addPayee: (payee: string) => void
  /** Removes a payee from the store */
  removePayee: (payee: string) => void
  /** Updates an existing payee in the store */
  updatePayee: (payeeUpdatePayload: PayeeUpdatePayload) => void
  /** Adds a new category to the store */
  addCategory: (categoryName: string) => void
  /** Deletes a category from the store by its name */
  deleteCategory: (categoryName: string) => void
  /** Edits an existing category in the store identified by its old name */
  updateCategory: (categoryUpdatePayload: CategoryUpdatePayload) => void
}

type CategoryUpdatePayload = {
  oldName: string
  newDetails: CategoryDetails
}

type AccountUpdatePayload = {
  oldName: string
  newDetails: AccountDetails
}

type PayeeUpdatePayload = {
  oldName: string
  newName: string
}

const useBudgetStore = create<budgetStore>((set, get) => ({
  loaded: false,
  transactions: [],
  accounts: [],
  payees: [],
  categories: [],
  getAllTransactions: () => get().transactions,
  load: () => {
    set((state) => ({
      loaded: true,
    }))
  },
  isLoaded: () => get().loaded,
  /**Sums up all transactions for a given account */
  getBalanceByAccount: (accountName) =>
    get()
      .getTransactionsByAccount(accountName)
      .reduce((acc, transaction) => acc + transaction.cents, 0),
  /**Sums up all transactions for a given category */
  getBalanceByCategory: (categoryName) =>
    get()
      .getTransactionsByCategory(categoryName)
      .reduce((acc, transaction) => acc + transaction.cents, 0),
  getTransactionsByAccount: (accountName) =>
    get().transactions.filter(
      (transaction) => transaction.account === accountName
    ),
  getTransactionsByPayee: (payeeName) =>
    get().transactions.filter((transaction) => transaction.payee === payeeName),
  getTransactionsByCategory: (categoryName) =>
    get().transactions.filter(
      (transaction) => transaction.category === categoryName
    ),
  /**Sums up the amounts from every transaction */
  netBalanceCents: () =>
    get().transactions.reduce((acc, transaction) => acc + transaction.cents, 0),
  /**Sums up all allocated amounts in every category */
  totalAssigned: () =>
    get().categories.reduce((acc, category) => acc + category.allocated, 0),

  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),
  deleteAccount: (accountName) =>
    set((state) => ({
      accounts: state.accounts.filter(
        (account) => account.name !== accountName
      ),
      transactions: state.transactions.filter(
        (transaction) => transaction.account !== accountName
      ),
    })),
  updateAccount: (accountUpdatePayload) =>
    set((state) => ({
      accounts: state.accounts.map((account) => {
        if (account.name === accountUpdatePayload.oldName) {
          return accountUpdatePayload.newDetails
        }
        return account
      }),
    })),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),
  removeTransaction: (transactionId) =>
    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== transactionId
      ),
    })),
  updateTransaction: (updatedTransactionDetails) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) => {
        if (transaction.id === updatedTransactionDetails.id) {
          return updatedTransactionDetails
        }
        return transaction
      }),
    })),
  addPayee: (payee) =>
    set((state) => ({
      payees: [...state.payees, payee],
    })),
  removePayee: (payee) =>
    set((state) => ({
      payees: state.payees.filter((p) => p !== payee),
    })),
  updatePayee: (payeeUpdatePayload) =>
    set((state) => ({
      payees: state.payees.map((payee) => {
        if (payee === payeeUpdatePayload.oldName) {
          return payeeUpdatePayload.newName
        }
        return payee
      }),
    })),
  addCategory: (categoryName) =>
    set((state) => {
      if (state.categories.find((c) => c.name === categoryName)) {
        throw new Error('Category already exists')
      }
      const newCategory: CategoryDetails = {
        name: categoryName,
        allocated: 0,
        permanent: false,
      }
      return { categories: [...state.categories, newCategory] }
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
}))

export default useBudgetStore
