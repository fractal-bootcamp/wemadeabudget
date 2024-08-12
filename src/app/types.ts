export interface User {
  username: string
  email: string
  clerkId: string
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
export const FlagDetails: Record<Flag, { display: string; hexCode: string }> = {
  NONE: { display: 'None', hexCode: '#f0f0f0' },
  RED: { display: 'Red', hexCode: '#ff0000' },
  ORANGE: { display: 'Orange', hexCode: '#ff7f00' },
  YELLOW: { display: 'Yellow', hexCode: '#ffff00' },
  GREEN: { display: 'Green', hexCode: '#00ff00' },
  BLUE: { display: 'Blue', hexCode: '#0000ff' },
  PURPLE: { display: 'Purple', hexCode: '#7f00ff' },
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
  flag: Flag
  cleared: boolean
}
export const emptyTransaction: TransactionDetails = {
  id: '',
  account: '',
  category: '',
  payee: '',
  date: new Date(),
  cents: 0,
  memo: '',
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
const defaultAccounts: AccountDetails[] = [
  { name: 'Checking', type: 'CHECKING' },
  { name: 'Savings', type: 'SAVINGS' },
  { name: 'Cash', type: 'CASH' },
  { name: 'Credit Card', type: 'CREDIT_CARD' },
]
const defaultPayees = ['Starting Balance']
interface Defaults {
  categories: string[]
  permanentCategories: string[]
  accounts: AccountDetails[]
  payees: PayeeDetails[]
}
export const defaults: Defaults = {
  categories: defaultCategories,
  permanentCategories: defaultPermanetCategories,
  accounts: defaultAccounts,
  payees: defaultPayees.map((name) => ({ name })),
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
  memo: 'Account starting balance (entered automatically)',
  flag: 'NONE',
  cleared: true,
})
