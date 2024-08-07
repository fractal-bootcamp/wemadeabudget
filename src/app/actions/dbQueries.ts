"use server";
import { AccountDetails, TransactionDetails } from "../types";
import prisma from "../client";
import { Account } from "@prisma/client";

export async function createCategory(categoryName: string, userId: string) {
  const newCategory = await prisma.category.create({
    data: {
      name: categoryName,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
export async function deleteCategory(name: string, userId: string) {
  const ret = await prisma.category.delete({
    where: {
      categoryId: {
        userId: userId,
        name: name
      }
    }
  });
}
interface UserSignupDetails {
  username: string;
  email: string;
  clerkId: string;
}
export async function dbAddUser(details: UserSignupDetails) {
  const newUser = await prisma.user.create({
    data: details
  });
}
export async function dbAddBudgetAccount(
  details: AccountDetails,
  userId: string
) {
  const newAccount = await prisma.account.create({
    data: {
      name: details.name,
      type: details.type,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
  return newAccount;
}

export async function postNewTransaction(
  transaction: TransactionDetails,
  userId: string
) {
  const postRes = await prisma.transaction.create({
    data: {
      date: transaction.date,
      cents: transaction.cents,
      memo: transaction.memo,
      category: {
        connectOrCreate: {
          where: {
            categoryId: {
              userId: userId,
              name: transaction.category
            }
          },
          create: {
            user: {
              connect: {
                id: userId
              }
            },
            name: transaction.category
          }
        }
      },
      payee: {
        connect: {
          payeeId: {
            userId: userId,
            name: transaction.payee
          }
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      flag: transaction.flag,
      account: {
        connect: {
          accountId: {
            userId: userId,
            name: transaction.account
          }
        }
      }
    }
  });
  return postRes;
}
