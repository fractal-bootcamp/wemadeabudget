// Local-only stubs that replace the original Postgres-backed server-action
// controller (preserved at src/legacy/controller.ts). The signature surface
// here matches the live import sites, but every mutation is a no-op — the
// zustand store with persist middleware is the source of truth now. The
// helper in utils.ts (updateStoreAndDb) only invokes storeFunction, so these
// dbXxx exports are functionally unused; they exist so the component imports
// resolve and so the auth/DB path can be revived without touching call sites.

import {
  AccountDetails,
  AccountUpdatePayload,
  CategoryDetails,
  CategoryUpdatePayload,
  PayeeDetails,
  PayeeUpdatePayload,
  TransactionDetails,
} from '../types'

const noop = async <T>(_payload?: T): Promise<void> => {}
const emptyList = async <T>(): Promise<T[]> => []

export const dbTransactionAdd: (p: TransactionDetails) => Promise<void> = noop
export const dbTransactionAddTransfer: (
  p: TransactionDetails
) => Promise<void> = noop
export const dbTransactionDelete: (p: string) => Promise<void> = noop
export const dbTransactionDeleteTransfer: (p: string) => Promise<void> = noop
export const dbTransactionUpdate: (
  p: TransactionDetails
) => Promise<void> = noop
export const dbTransactionUpdateTransfer: (
  p: TransactionDetails
) => Promise<void> = noop
export const dbTransactionGetById: (
  p: string
) => Promise<TransactionDetails | null> = async () => null
export const dbTransactionGetAllByUser: () => Promise<TransactionDetails[]> =
  emptyList
export const dbTransactionGetByCategory: (
  p: string
) => Promise<TransactionDetails[]> = emptyList
export const dbTransactionGetByPayee: (
  p: string
) => Promise<TransactionDetails[]> = emptyList
export const dbTransactionGetByAccount: (
  p: string
) => Promise<TransactionDetails[]> = emptyList

export const dbCategoryAdd: (p: CategoryDetails) => Promise<void> = noop
export const dbCategoryDelete: (p: string) => Promise<void> = noop
export const dbCategoryGetAllByUser: () => Promise<CategoryDetails[]> =
  emptyList
export const dbCategoryUpdate: (p: CategoryUpdatePayload) => Promise<void> =
  noop

export const dbPayeeAdd: (p: PayeeDetails) => Promise<void> = noop
export const dbPayeeDelete: (p: string) => Promise<void> = noop
export const dbPayeeGetAllByUser: () => Promise<PayeeDetails[]> = emptyList
export const dbPayeeUpdate: (p: PayeeUpdatePayload) => Promise<void> = noop

export const dbAccountAdd: (p: AccountDetails) => Promise<void> = noop
export const dbAccountDelete: (p: string) => Promise<void> = noop
export const dbAccountGetAllByUser: () => Promise<AccountDetails[]> = emptyList
export const dbAccountUpdate: (p: AccountUpdatePayload) => Promise<void> = noop
