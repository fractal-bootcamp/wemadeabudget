import { User } from '@clerk/nextjs/server'
import { create } from 'zustand'
import {
  AccountDetails,
  TransactionDetails,
  CategoryDetails,
  Category,
} from '../types'

type budgetStore = {
  transactions: TransactionDetails[]
  accounts: AccountDetails[]
  payees: string[]
  categories: CategoryDetails[]
  getBalanceByAccount: (accountName: string) => number
  getBalanceByCategory: (categoryName: string) => number
  getTransactionsByAccount: (accountName: string) => TransactionDetails[]
  getTransactionsByPayee: (payeeName: string) => TransactionDetails[]
  getTransactionsByCategory: (categoryName: string) => TransactionDetails[]
  addAccount: (account: AccountDetails) => void
  removeAccount: (accountName: string) => void
  addTransaction: (transaction: TransactionDetails) => void
  removeTransaction: (transactionId: string) => void
  addPayee: (payee: string) => void
  removePayee: (payee: string) => void
  addCategory: (category: CategoryDetails) => void
  removeCategory: (categoryName: string) => void
}

const useBudgetStore = create<budgetStore>((set, get) => ({
  transactions: [],
  accounts: [],
  payees: [],
  categories: [],
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

  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),
  removeAccount: (accountName) =>
    set((state) => ({
      accounts: state.accounts.filter(
        (account) => account.name !== accountName
      ),
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
  addPayee: (payee) =>
    set((state) => ({
      payees: [...state.payees, payee],
    })),
  removePayee: (payee) =>
    set((state) => ({
      payees: state.payees.filter((p) => p !== payee),
    })),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  removeCategory: (categoryName) =>
    set((state) => ({
      categories: state.categories.filter(
        (category) => category.name !== categoryName
      ),
    })),
}))

export default useBudgetStore
