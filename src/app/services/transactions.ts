import { get } from "http";
import prisma from "../client";
import { TransactionDetails } from "../types";
//This is a helper object that is used to include the name field in the related models to the transactions
const nameInclusions = {
  account: {
    select: {
      name: true
    }
  },
  category: {
    select: {
      name: true
    }
  },
  payee: {
    select: {
      name: true
    }
  }
};

const queries = {
  getAllTransactionsByUser: async (userId: string) => {
    return await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      include: nameInclusions
    });
  },
  getTransactionsByCategory: async (userId: string, categoryName: string) => {
    return await prisma.transaction.findMany({
      where: {
        category: {
          name: categoryName,
          userId: userId
        }
      },
      include: nameInclusions
    });
  },
  getTransactionsByPayee: async (userId: string, payeeName: string) => {
    return await prisma.transaction.findMany({
      where: {
        payee: {
          name: payeeName,
          userId: userId
        }
      },
      include: nameInclusions
    });
  },
  getTransactionById: async (transactionId: string, userId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
        userId: userId
      },
      include: nameInclusions
    });
    return transaction;
  },
  getTransactionsByAccount: async (userId: string, accountName: string) => {
    return await prisma.transaction.findMany({
      where: {
        account: {
          name: accountName,
          userId: userId
        }
      },
      include: nameInclusions
    });
  }
};
const mutations = {
  deleteTransaction: async (transactionId: string, userId: string) => {
    const removedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId
      }
    });
    return removedTransaction;
  },
  addTransaction: async (details: TransactionDetails, userId: string) => {
    const newTransaction = await prisma.transaction.create({
      data: {
        date: details.date,
        cents: details.cents,
        memo: details.memo,
        account: {
          connect: {
            accountId: {
              userId: userId,
              name: details.account
            }
          }
        },
        category: {
          connect: {
            categoryId: {
              userId: userId,
              name: details.category
            }
          }
        },
        payee: {
          connect: {
            payeeId: {
              userId: userId,
              name: details.payee
            }
          }
        },
        flag: details.flag,
        cleared: details.cleared,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return newTransaction;
  },
  updateTransaction: async (details: TransactionDetails, userId: string) => {
    //Look up the transaciton and make sure it belongs to the specified user
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id: details.id
      },
      select: { userId: true }
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    if (existingTransaction.userId !== userId) {
      throw new Error("Transaction does not belong to the user");
    }

    // Transaction exists and belongs to the user, update it
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: details.id
      },
      data: {
        date: details.date,
        cents: details.cents,
        memo: details.memo,
        account: {
          connect: {
            accountId: {
              userId: userId,
              name: details.account
            }
          }
        },
        category: {
          connect: {
            categoryId: {
              userId: userId,
              name: details.category
            }
          }
        },
        payee: {
          connect: {
            payeeId: {
              userId: userId,
              name: details.payee
            }
          }
        },
        flag: details.flag,
        cleared: details.cleared,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return updatedTransaction;
  }
};
const transactionServices = {
  add: async (userId: string, details: TransactionDetails) =>
    await mutations.addTransaction(details, userId),
  delete: async (userId: string, transactionId: string) =>
    await mutations.deleteTransaction(transactionId, userId),
  update: async (userId: string, details: TransactionDetails) =>
    await mutations.updateTransaction(details, userId),
  getById: async (userId: string, transactionId: string) =>
    await queries.getTransactionById(transactionId, userId),
  getAllByUser: async (userId: string) =>
    await queries.getAllTransactionsByUser(userId),
  getByCategory: async (userId: string, categoryName: string) =>
    await queries.getTransactionsByCategory(userId, categoryName),
  getByPayee: async (userId: string, payeeName: string) =>
    await queries.getTransactionsByPayee(userId, payeeName),
  getByAccount: async (userId: string, accountName: string) =>
    await queries.getTransactionsByAccount(userId, accountName)
};

export default transactionServices;
