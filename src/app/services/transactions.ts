import prisma from "../client";
import { TransactionDetails } from "../types";

const queries = {
  getAllTransactionsByUser: async (userId: string) => {
    return await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        date: true,
        cents: true,
        memo: true,
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
        },
        flag: true,
        cleared: true
      }
    });
  },
  getTransactionById: async (transactionId: string, userId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
        userId: userId
      },
      select: {
        id: true,
        date: true,
        cents: true,
        memo: true,
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
        },
        cleared: true,
        flag: true
      }
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
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
export const transactionServices = {
  add: async (userId: string, details: TransactionDetails) =>
    await mutations.addTransaction(details, userId),
  delete: async (userId: string, transactionId: string) =>
    await mutations.deleteTransaction(transactionId, userId),
  getById: async (userId: string, transactionId: string) =>
    await queries.getTransactionById(transactionId, userId),
  getAllByUser: async (userId: string) =>
    await queries.getAllTransactionsByUser(userId),
  update: async (userId: string, details: TransactionDetails) =>
    await mutations.updateTransaction(details, userId)
};
