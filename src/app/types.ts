export interface User {
  username: string
  email: string
  clerkId: string
}
export type UserUpdatePayload = {
  email?: string
  username?: string
}
const AccountTypes = ['CHECKING', 'CASH', 'CREDIT_CARD', 'SAVINGS'] as const

export type AccountType = (typeof AccountTypes)[number]
export const AccountTypeDetails: Record<AccountType, { display: string }> = {
  CHECKING: { display: 'Checking' },
  CASH: { display: 'Cash' },
  CREDIT_CARD: { display: 'Credit Card' },
  SAVINGS: { display: 'Savings' },
}
const Flags = [
  'NONE',
  'RED',
  'ORANGE',
  'YELLOW',
  'GREEN',
  'BLUE',
  'PURPLE',
] as const
export type Flag = (typeof Flags)[number]
export const FlagDetails: Record<
  Flag,
  { display: string; hexCode: string; lighterHexCode: string }
> = {
  NONE: { display: 'None', hexCode: '#ffffff', lighterHexCode: '#ffffff' },
  RED: { display: 'Red', hexCode: '#ff0000', lighterHexCode: '#ff9999' },
  ORANGE: { display: 'Orange', hexCode: '#ff7f00', lighterHexCode: '#ffcc99' },
  YELLOW: { display: 'Yellow', hexCode: '#ffdd00', lighterHexCode: '#fff5b3' },
  GREEN: { display: 'Green', hexCode: '#3dc762', lighterHexCode: '#8cdea2' },
  BLUE: { display: 'Blue', hexCode: '#00a0ff', lighterHexCode: '#99daff' },
  PURPLE: { display: 'Purple', hexCode: '#7f00ff', lighterHexCode: '#cc99ff' },
}
/** Mapes a type details obj to an array for mapped access to all type details
 * e.g. to write out all Account types: typeDetailsArray(AccountTypeDetails).map(acctType => acctType.display)
 * whereas e.g. to access the color code for a provided flag: FlagDetails[flag].hexCode
 */
//prettier-ignore
export const typeDetailsArray = <T extends string, S extends {display: string}>(detailsObj: Record<T, S>) => {
  return Object.keys(detailsObj).map(key => ({ type: key as T, ...detailsObj[key as T] }))
}

export type TransactionDetails = {
  id: string
  account: string
  category: string
  payee: string
  date: Date
  cents: number
  memo: string
  transfer: boolean
  pairedTransferId: string | null //id of the corresponding transaction for a transfer
  flag: Flag
  cleared: boolean
}
export type TransferDetails = TransactionDetails & { transfer: true }
export const isTransfer = (
  details: TransactionDetails
): details is TransferDetails => details.pairedTransferId !== null
export const emptyTransaction: TransactionDetails = {
  id: '',
  account: '',
  category: '',
  payee: '',
  date: new Date(),
  cents: 0,
  memo: '',
  transfer: false,
  pairedTransferId: null,
  flag: 'NONE',
  cleared: false,
}
export type CategoryDetails = {
  name: string
  allocated: number
  permanent: boolean
  // categoryGroupName: string;
}
export interface CategoryUpdatePayload {
  oldName: string
  newDetails: CategoryDetails
}
export interface AccountDetails {
  name: string
  type: AccountType
}
export interface AccountUpdatePayload {
  oldName: string
  newDetails: AccountDetails
}

export const emptyAccount: AccountDetails = {
  name: '',
  type: 'CHECKING',
}
export interface PayeeDetails {
  name: string
  accountTransfer: boolean
}
export const accountTransferPayee = (accountName: string): PayeeDetails => ({
  name: `Transfer to/from: ${accountName}`,
  accountTransfer: true,
})
export const extractTransferAccount = (payeeName: string): string => {
  const accountName = payeeName.split(':')[1].trim()
  return accountName
}
export interface PayeeUpdatePayload {
  oldName: string
  newName: string
}

const defaultCategories = [
  'Restaurants',
  'Rent',
  'Utilities',
  'Renters Insurance',
  'Phone',
  'Internet',
  'Music',
  'Groceries',
  'Train/Bus Fare',
  'Personal Care',
  'Stuff I Forgot to Budget For',
  'Celebrations',
]
const defaultPermanetCategories = ['Uncategorized', 'Ready to Assign']
const defaultCategoryDetails = [
  ...defaultCategories.map((name) => ({
    name,
    allocated: 0,
    permanent: false,
  })),
  ...defaultPermanetCategories.map((name) => ({
    name,
    allocated: 0,
    permanent: true,
  })),
]
const defaultAccounts: AccountDetails[] = [
  { name: 'Checking', type: 'CHECKING' },
  { name: 'Savings', type: 'SAVINGS' },
  { name: 'Cash', type: 'CASH' },
  { name: 'Credit Card', type: 'CREDIT_CARD' },
]
const defaultPayees = ['Starting Balance']
interface Defaults {
  categories: CategoryDetails[]
  accounts: AccountDetails[]
  payees: PayeeDetails[]
}
export const defaults: Defaults = {
  categories: defaultCategoryDetails,
  accounts: defaultAccounts,
  payees: defaultPayees.map((name) => ({ name, accountTransfer: false })),
}

export const startingBalanceTransaction = (
  accountName: string,
  cents: number
): TransactionDetails => ({
  id: '',
  account: accountName,
  category: 'Ready to Assign',
  payee: 'Starting Balance',
  date: new Date(),
  cents,
  transfer: false,
  pairedTransferId: null,
  memo: 'Account starting balance (entered automatically)',
  flag: 'NONE',
  cleared: true,
})
