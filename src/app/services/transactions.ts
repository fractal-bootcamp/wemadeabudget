import prisma from '../client'
import {
  accountTransferPayee,
  extractTransferAccount,
  TransactionDetails,
} from '../types'
import { Prisma, Transaction } from '@prisma/client'
import { TransactionService } from './interfaces'
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
} satisfies Prisma.TransactionInclude
const newTransactionDataPayload = (
  userId: string,
  details: TransactionDetails
) => ({
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
  transfer: details.transfer,
  flag: details.flag,
  cleared: details.cleared,
  user: {
    connect: {
      id: userId,
    },
  },
})
//What a database transaction response looks like when names above included
interface FetchedTransaction extends Transaction {
  account: { name: string }
  category: { name: string }
  payee: { name: string }
}
const selects: Prisma.TransactionSelect = {
  id: true,
  date: true,
  cents: true,
  memo: true,
  transfer: true,
  pairedTransferId: true,
  flag: true,
  cleared: true,
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
/**Formats a database transaction response from prisma into a TransactionDetails object; selects fields and flattens name fields*/
const formatTransaction = (
  transaction: FetchedTransaction
): TransactionDetails => {
  return {
    id: transaction.id,
    account: transaction.account.name,
    category: transaction.category.name,
    payee: transaction.payee.name,
    date: transaction.date,
    transfer: transaction.transfer,
    pairedTransferId: transaction.pairedTransferId,
    cents: transaction.cents,
    memo: transaction.memo,
    flag: transaction.flag,
    cleared: transaction.cleared,
  }
}

const queries = {
  getAllTransactionsByUser: async (userId: string) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: nameInclusions,
    })
    return transactions
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
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })
    if (transaction?.transfer) {
      throw new Error('Use deleteTransfer instead')
    }
    const removedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
      include: nameInclusions,
    })
    return removedTransaction
  },
  deleteTransfer: async (transactionId: string, userId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      // include: nameInclusions,
    })
    if (!transaction?.pairedTransferId) {
      throw new Error('Transaction is not a transfer')
    }
    const removedTransaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
      include: nameInclusions,
    })
    const removedPairedTransfer = await prisma.transaction.delete({
      where: {
        id: transaction.pairedTransferId,
      },
      include: nameInclusions,
    })
    return {
      transaction: removedTransaction,
      pairedTransfer: removedPairedTransfer,
    }
  },
  add: async (userId: string, details: TransactionDetails) => {
    //the creation data for the base transaction (for reuse if we are creating a paired transfer transcation)
    if (details.transfer) {
      throw new Error('Use addTransfer instead')
    }
    const data = newTransactionDataPayload(userId, details)
    const newTransaction = await prisma.transaction.create({
      data,
      include: nameInclusions,
    })
    return newTransaction
  },
  addTransfer: async (userId: string, details: TransactionDetails) => {
    const data = newTransactionDataPayload(userId, details)
    const newTransaction = await prisma.transaction.create({
      data: {
        ...data,
        pairedTransfer: {
          //createa a paired transfer transaciton with similar details
          create: {
            //same data as the transaction we are creating
            ...data,
            //...except for the following fields

            //inverse amount
            cents: -1 * details.cents,
            //payee is the account of the original transaction
            payee: {
              connect: {
                payeeId: {
                  userId: userId,
                  name: accountTransferPayee(details.account).name,
                },
              },
            },
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
        },
      },
      include: {
        ...nameInclusions,
        pairedTransfer: { include: nameInclusions },
      },
    })
    const { pairedTransfer, ...transactionWithoutPairedTransfer } =
      newTransaction
    if (!pairedTransfer) {
      throw new Error('Paired transfer not created? (this should never happen)')
    }
    return {
      transaction: transactionWithoutPairedTransfer,
      pairedTransfer: pairedTransfer,
    }
  },
  /**Transfer transactions can only be updated in terms of details; they cant change account/payee and must be deleted and recreated instead*/
  updateTransfer: async (userId: string, details: TransactionDetails) => {
    //Look up the transaciton and make sure it belongs to the specified user
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        userId: userId,
        id: details.id,
      },
      include: nameInclusions,
    })
    //check for error cases:
    switch (true) {
      case !existingTransaction:
        throw new Error('Transaction not found')
      case !existingTransaction?.pairedTransferId:
        throw new Error('Existing transaction is not a transfer')
      case !details.transfer:
        throw new Error('Incoming details must still be a transfer')
      case details.account !== existingTransaction?.account.name ||
        details.payee !== existingTransaction?.payee.name:
        throw new Error(
          'Transfer transactions can only be updated in terms of details; they cant change account/payee and must be deleted and recreated instead'
        )
    }
    // update both transactions with the new details:
    //the initial transaction being updated:
    const updateData = {
      date: details.date,
      cents: details.cents,
      memo: details.memo,
      category: {
        connect: {
          categoryId: {
            userId: userId,
            name: details.category,
          },
        },
      },
      flag: details.flag,
      cleared: details.cleared,
    }
    const updatedPairedTransferData = {
      ...updateData,
      //inverse amount
      cents: -1 * details.cents,
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: existingTransaction.id,
      },
      data: updateData,
      include: nameInclusions,
    })
    const updatedPairedTransfer = await prisma.transaction.update({
      where: {
        id: existingTransaction.pairedTransferId,
      },
      data: updatedPairedTransferData,
      include: nameInclusions,
    })
    return {
      transaction: updatedTransaction,
      pairedTransfer: updatedPairedTransfer,
    }
  },

  updateTransaction: async (details: TransactionDetails, userId: string) => {
    //Look up the transaciton and make sure it belongs to the specified user
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id: details.id,
      },
    })
    switch (true) {
      case !existingTransaction:
        throw new Error('Transaction not found')
      case existingTransaction?.userId !== userId:
        throw new Error('Transaction does not belong to the attached user')
      case existingTransaction?.transfer || details.transfer:
        throw new Error('Use updateTransfer for transfer transactions')
    }
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: details.id,
      },
      data: newTransactionDataPayload(userId, details),
      include: nameInclusions,
    })
    //if this is a non-transfer becoming a transfer, just delete and make transfer

    return updatedTransaction
  },
}
const transactionServices: TransactionService = {
  add: async (userId: string, details: TransactionDetails) => {
    return formatTransaction(await mutations.add(userId, details))
  },
  addTransfer: async (userId: string, details: TransactionDetails) => {
    //create the first transaction
    const { transaction, pairedTransfer } = await mutations.addTransfer(
      userId,
      details
    )
    return {
      transaction: formatTransaction(transaction),
      pairedTransfer: formatTransaction(pairedTransfer),
    }
  },
  delete: async (userId: string, transactionId: string) =>
    formatTransaction(await mutations.deleteTransaction(transactionId, userId)),
  deleteTransfer: async (transactionId: string, userId: string) => {
    const { transaction, pairedTransfer } = await mutations.deleteTransfer(
      transactionId,
      userId
    )
    return {
      transaction: formatTransaction(transaction),
      pairedTransfer: formatTransaction(pairedTransfer),
    }
  },
  update: async (userId: string, details: TransactionDetails) =>
    formatTransaction(await mutations.updateTransaction(details, userId)),
  updateTransfer: async (userId: string, details: TransactionDetails) => {
    const { transaction, pairedTransfer } = await mutations.updateTransfer(
      userId,
      details
    )
    return {
      transaction: formatTransaction(transaction),
      pairedTransfer: formatTransaction(pairedTransfer),
    }
  },
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
