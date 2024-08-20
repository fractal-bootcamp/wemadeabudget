import { AccountDetails, AccountUpdatePayload, CategoryDetails, CategoryUpdatePayload, PayeeDetails, PayeeUpdatePayload, TransactionDetails } from "../types"

export type TransactionService = {
  add: (userId: string, details: TransactionDetails) => Promise<TransactionDetails>
  addTransfer: (userId: string, details: TransactionDetails) => Promise<{ transaction: TransactionDetails, pairedTransfer: TransactionDetails }>
  delete: (userId: string, transactionId: string) => Promise<TransactionDetails>
  deleteTransfer: (transactionId: string, userId: string) => Promise<{ transaction: TransactionDetails, pairedTransfer: TransactionDetails }>
  update: (userId: string, details: TransactionDetails) => Promise<TransactionDetails>
  updateTransfer: (userId: string, details: TransactionDetails) => Promise<{ transaction: TransactionDetails, pairedTransfer: TransactionDetails }>
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
  getByName: (userId: string, payeeName: string) => Promise<PayeeDetails | null>
  add: (userId: string, newPayee: PayeeDetails) => Promise<PayeeDetails>
  delete: (userId: string, payeeName: string) => Promise<PayeeDetails>
  update: (userId: string, payeeUpdatePayload: PayeeUpdatePayload) => Promise<PayeeDetails>
}

export type UserService = {
  findByClerkId: (clerkId: string) => Promise<{ id: string } | null>
  addOrFetchUserFromClerkId: (clerkId: string, email: string, username: string) => Promise<{ id: string }>
  deleteUser: (userId: string) => Promise<{id: string}>
}