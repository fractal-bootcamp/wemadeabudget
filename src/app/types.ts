export interface User {
  username: string
  email: string
  clerkId: string
}
export type AccountType = 'CHECKING' | 'CASH' | 'CREDIT_CARD' | 'SAVINGS'
export type Flag =
  | 'NONE'
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'PURPLE'
export const flagColors = {
  NONE: '#f0f0f0',
  RED: '#ff0000',
  ORANGE: '#ff7f00',
  YELLOW: '#ffff00',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
  PURPLE: '#7f00ff',
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
  // categoryGroupName: string;
}

export interface AccountDetails {
  name: string
  type: AccountType
}
export const emptyAccount: AccountDetails = {
  name: '',
  type: 'CHECKING',
}
export interface Category {
  name: string
}
export interface PayeeDetails {
  name: string
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
const defaultPermanetCategories = ['Uncategorized', 'Ready To Assign']
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
  category: 'Ready To Assign',
  payee: 'Starting Balance',
  date: new Date(),
  cents,
  memo: 'Account starting balance (entered automatically)',
  flag: 'NONE',
  cleared: true,
})
