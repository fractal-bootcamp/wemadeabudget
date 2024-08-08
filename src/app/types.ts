export interface User {
  username: string;
  email: string;
  clerkId: string;
}
export type AccountType = "CHECKING" | "CASH" | "CREDIT_CARD";
export type Flag = "RED" | "ORANGE" | "YELLOW" | "GREEN" | "BLUE" | "PURPLE";
export type TransactionDetails = {
  id: string;
  account: string;
  category: string;
  payee: string;
  date: string;
  cents: number;
  memo: string;
  flag: Flag;
  cleared: boolean;
};
export type CategoryDetails = {
  name: string;
  allocated: number;
  // categoryGroupName: string;
};
export interface AccountDetails {
  name: string;
  type: AccountType;
}

export interface Category {
  name: string;
}
