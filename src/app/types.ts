export interface User {
  username: string
  email: string
  clerkId: string
}
export type AccountType = 'CHECKING' | 'CASH' | 'CREDIT_CARD'
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
