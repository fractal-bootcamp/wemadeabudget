import prisma from '../client'
import { extractTransferAccount, TransactionDetails } from '../types'
import { Transaction } from '@prisma/client'
import payeeServices from './payees'
import { disconnect } from 'process'
//This is a helper object that is used to include the name field in the related models to the transactions
const nameInclusions = {
  account: {
    select: {
      name: true,
    },
  },
  category: {
    select: {
      name: true,
    },
  },
  payee: {
    select: {
      name: true,
    },
  },
}

//What a database transaction response looks like when names above included
interface FetchedTransaction extends Transaction {
  account: { name: string }
  category: { name: string }
  payee: { name: string }
}

const formatTransaction = (
  transaction: FetchedTransaction
): TransactionDetails => {
  return {
    id: transaction.id,
    account: transaction.account.name,
    category: transaction.category.name,
    payee: transaction.payee.name,
    date: transaction.date,
    pairedTransferId: transaction.pairedTransferId,
    cents: transaction.cents,
    memo: transaction.memo,
    flag: transaction.flag,
    cleared: transaction.cleared,
  }
}

const queries = {
  getAllTransactionsByUser: async (userId: string) => {
    return await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: nameInclusions,
    })
  },
  getTransactionsByCategory: async (userId: string, categoryName: string) => {
    return await prisma.transaction.findMany({
      where: {
        category: {
          name: categoryName,
          userId: userId,
        },
      },
      include: nameInclusions,
    })
  },
  getTransactionsByPayee: async (userId: string, payeeName: string) => {
    return await prisma.transaction.findMany({
      where: {
        payee: {
          name: payeeName,
          userId: userId,
        },
      },
      include: nameInclusions,
    })
  },
  getTransactionById: async (transactionId: string, userId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
        userId: userId,
      },
      include: nameInclusions,
    })
    return transaction
  },
  getTransactionsByAccount: async (userId: string, accountName: string) => {
    return await prisma.transaction.findMany({
      where: {
        account: {
          name: accountName,
          userId: userId,
        },
      },
      include: nameInclusions,
    })
  },
}
const mutations = {
  deleteTransaction: async (transactionId: string, userId: string) => {
    const removedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    })
    return removedTransaction
  },
  addTransaction: async (details: TransactionDetails, userId: string) => {
    //the creation data for the base transaction (for reuse if we are creating a paired transfer transcation)
    const data = {
      date: details.date,
      cents: details.cents,
      memo: details.memo,
      account: {
        connect: {
          accountId: {
            userId: userId,
            name: details.account,
          },
        },
      },
      category: {
        connectOrCreate: {
          where: {
            categoryId: {
              userId: userId,
              name: details.category,
            },
          },
          create: {
            name: details.category,
            userId: userId,
            allocated: 0,
          },
        },
      },
      payee: {
        connect: {
          payeeId: {
            userId: userId,
            name: details.payee,
          },
        },
      },
      flag: details.flag,
      cleared: details.cleared,
      user: {
        connect: {
          id: userId,
        },
      },
    }
    const newTransaction = await prisma.transaction.create({
      data: {
        ...data,
        pairedTransfer: details.pairedTransferId
          ? {
              //createa a paired transfer transaciton with similar details
              create: {
                //same data as the transaction we are creating
                ...data,
                //...except for the following fields

                //inverse amount
                cents: -1 * details.cents,
                //transfer account extracted from the payee details (feels iffy)
                account: {
                  connect: {
                    accountId: {
                      userId: userId,
                      name: extractTransferAccount(details.payee),
                    },
                  },
                },
              },
            }
          : {}, //if not a transfer, don't create a paired transfer
      },
    })
    return newTransaction
  },
  updateTransaction: async (details: TransactionDetails, userId: string) => {
    //Look up the transaciton and make sure it belongs to the specified user
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id: details.id,
      },
    })

    if (!existingTransaction) {
      throw new Error('Transaction not found')
    }
    if (existingTransaction.userId !== userId) {
      throw new Error('Transaction does not belong to the attached user')
    }
    if (existingTransaction.pairedTransferId) {
      //you know what, fuck it, if we are updating something that used to be a transfer, just delete both and recreate while preserving the createdAt timestamp

      //save the creation timestamp (is this kosher? should we "falsify" this kind of DB data?)
      const createdAt = existingTransaction.createdAt
      //delete this existing transaction (and by cascade, the paired transfer)
      await mutations.deleteTransaction(existingTransaction.id, userId)
      //create a new transaction entity with the new details, which should handle a new paired transfer too
      return await mutations.addTransaction(details, userId)
    }
    //if not a transfer, just do a normal update :)
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: details.id,
      },
      data: {
        date: details.date,
        cents: details.cents,
        memo: details.memo,
        account: {
          connect: {
            accountId: {
              userId: userId,
              name: details.account,
            },
          },
        },
        category: {
          connect: {
            categoryId: {
              userId: userId,
              name: details.category,
            },
          },
        },
        payee: {
          connect: {
            payeeId: {
              userId: userId,
              name: details.payee,
            },
          },
        },
        flag: details.flag,
        cleared: details.cleared,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: nameInclusions,
    })
    return updatedTransaction
  },
}
const transactionServices = {
  add: async (userId: string, details: TransactionDetails) => {
    //create the transaction
    const thisTransaction = await mutations.addTransaction(details, userId)
    //check if transfer
    const payee = await payeeServices.getByName(userId, details.payee)
    //if transfer, add countervailing transaction on the other account
    if (payee?.accountTransfer) {
      const otherAccount = payee.name.split(':')[1].trim()
      const partnerTransaction = await mutations.addTransaction(
        {
          ...details,
          account: otherAccount,
          payee: details.account,
        },
        userId
      )
      //add the paired transfer relationship
    }
    return await mutations.addTransaction(details, userId)
  },
  delete: async (userId: string, transactionId: string) =>
    await mutations.deleteTransaction(transactionId, userId),
  update: async (userId: string, details: TransactionDetails) =>
    await mutations.updateTransaction(details, userId),
  getById: async (userId: string, transactionId: string) => {
    const transaction = await queries.getTransactionById(transactionId, userId)
    return transaction ? formatTransaction(transaction) : null
  },
  getAllByUser: async (userId: string) =>
    (await queries.getAllTransactionsByUser(userId)).map(formatTransaction),
  getByCategory: async (userId: string, categoryName: string) =>
    (await queries.getTransactionsByCategory(userId, categoryName)).map(
      formatTransaction
    ),
  getByPayee: async (userId: string, payeeName: string) =>
    (await queries.getTransactionsByPayee(userId, payeeName)).map(
      formatTransaction
    ),
  getByAccount: async (userId: string, accountName: string) =>
    (await queries.getTransactionsByAccount(userId, accountName)).map(
      formatTransaction
    ),
}

export default transactionServices
