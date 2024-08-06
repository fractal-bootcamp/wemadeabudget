import { User as DbUser, Transaction as DbTransaction } from "@prisma/client";

export interface User {
  username: string;
  email: string;
  clerkId: string;
}

/**The parameters of a local transaction */
export type TransactionDetails = Omit<
  DbTransaction,
  "id" | "userId" | "payeeId" | "accountId" | "categoryId"
> & {
  category: string;
  payee: string;
  account: string;
};

export interface Account {
  name: string;
  type: string;
}

export interface Category {
  name: string;
}
