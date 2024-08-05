export interface User {
  username: string;
  email: string;
  clerkId: string;
}

export interface Transaction {
  date: Date;
  cents: number;
  payee: string;
  memo: string;
  reconciled: boolean;
  category: string;
  account: string;
  flag: string;
}

export interface Account {
  name: string;
  type: string;
}

export interface Category {
  name: string;
}
