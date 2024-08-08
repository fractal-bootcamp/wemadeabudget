import { User } from '@clerk/nextjs/server'
import { create } from 'zustand'
import { TransactionDetails } from '../types'

type transactionStore = {
  transactions: TransactionDetails[]
  addTransactions: (transactions: TransactionDetails[]) => void
}

const useTransactionStore = create<transactionStore>((set) => ({
  transactions: [],
  addTransactions: (transactions) =>
    set((state) => ({
      transactions: [...state.transactions, ...transactions],
    })),
}))

export default useTransactionStore
