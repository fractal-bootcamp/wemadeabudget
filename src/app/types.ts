export interface User {
  username: string
  email: string
  clerkId: string
}
const AccountTypes = ['CHECKING', 'CASH', 'CREDIT_CARD', 'SAVINGS'] as const

export type AccountType = (typeof AccountTypes)[number]

export const AccountTypeDetails: { type: AccountType; display: string }[] = [
  { type: 'CHECKING', display: 'Checking' },
  { type: 'CASH', display: 'Cash' },
  { type: 'CREDIT_CARD', display: 'Credit Card' },
  { type: 'SAVINGS', display: 'Savings' },
]

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
export const FlagDetails: { type: Flag; display: string; hexCode: string }[] = [
  { type: 'NONE', display: 'None', hexCode: '#f0f0f0' },
  { type: 'RED', display: 'Red', hexCode: '#ff0000' },
  { type: 'ORANGE', display: 'Orange', hexCode: '#ff7f00' },
  { type: 'YELLOW', display: 'Yellow', hexCode: '#ffff00' },
  { type: 'GREEN', display: 'Green', hexCode: '#00ff00' },
  { type: 'BLUE', display: 'Blue', hexCode: '#0000ff' },
  { type: 'PURPLE', display: 'Purple', hexCode: '#7f00ff' },
]
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
