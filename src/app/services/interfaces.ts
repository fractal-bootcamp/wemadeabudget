import { Transaction } from "@prisma/client"
import { AccountDetails, AccountUpdatePayload, CategoryDetails, CategoryUpdatePayload, PayeeDetails, PayeeUpdatePayload, TransactionDetails, TransferDetails } from "../types"

export type TransactionService = {
  add: (userId: string, details: TransactionDetails) => Promise<TransactionDetails>
  addTransfer: (userId: string, details: TransferDetails) => Promise<{ transaction: TransactionDetails, pairedTransfer: TransactionDetails }>
  delete: (userId: string, transactionId: string) => Promise<TransactionDetails>
  update: (userId: string, details: TransactionDetails) => Promise<TransactionDetails>
  updateTransfer: (userId: string, details: TransferDetails) => Promise<{ transaction: TransactionDetails, pairedTransfer: TransactionDetails }>
  getById: (userId: string, transactionId: string) => Promise<TransactionDetails | null>
  getAllByUser: (userId: string) => Promise<TransactionDetails[]>
  getByCategory: (userId: string, categoryName: string) => Promise<TransactionDetails[]>
  getByPayee: (userId: string, payeeName: string) => Promise<TransactionDetails[]>
  getByAccount: (userId: string, accountName: string) => Promise<TransactionDetails[]>
}

export type CategoryService = {
  getAllByUser: (userId: string) => Promise<CategoryDetails[]>
  add: (userId: string, newCategory: CategoryDetails) => Promise<CategoryDetails>
  delete: (userId: string, categoryName: string) => Promise<CategoryDetails>
  update: (userId: string, categoryUpdatePayload: CategoryUpdatePayload) => Promise<CategoryDetails>
}

export type AccountService = {
  getAllByUser: (userId: string) => Promise<AccountDetails[]>
  add: (userId: string, details: AccountDetails) => Promise<AccountDetails>
  delete: (userId: string, accountName: string) => Promise<AccountDetails>
  update: (userId: string, accountUpdatePayload: AccountUpdatePayload) => Promise<AccountDetails>
}

export type PayeeService = {
  getAllByUser: (userId: string) => Promise<PayeeDetails[]>
  getByName: (userId: string, payeeName: string) => Promise<{ name: string, accountTransfer: boolean } | null>
  add: (userId: string, newPayee: PayeeDetails) => Promise<void>
  delete: (userId: string, payeeName: string) => Promise<void>
  update: (userId: string, payeeUpdatePayload: PayeeUpdatePayload) => Promise<void>
}

export type UserService = {
  findByClerkId: (clerkId: string) => Promise<{ id: string } | null>
  addOrFetchUserFromClerkId: (clerkId: string, email: string, username: string) => Promise<{ id: string }>
  deleteUser: (userId: string) => Promise<{id: string}>
}