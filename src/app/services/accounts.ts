import { Prisma } from '@prisma/client'
import prisma from '../client'
import { AccountDetails } from '../types'

const queries = {
  /** Retrieve all accounts for a user */
  getAccounts: async (userId: string) => {
    const accounts = await prisma.account.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    })
    return accounts
  },
}

const mutations = {
  /** Add a specified account to a user */
  addAccount: async (userId: string, details: AccountDetails) => {
    const newAccount = await prisma.account.create({
      data: {
        name: details.name,
        type: details.type,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    return newAccount
  },
  deleteAccount: async (userId: string, accountName: string) => {
    const deletedAccount = await prisma.account.delete({
      where: {
        accountId: {
          name: accountName,
          userId: userId,
        },
      },
    })
    return deletedAccount
  },
  updateAccount: async (
    userId: string,
    oldName: string,
    newDetails: AccountDetails
  ) => {
    const updatedAccount = await prisma.account.update({
      where: {
        accountId: {
          name: oldName,
          userId: userId,
        },
      },
      data: {
        name: newDetails.name,
        type: newDetails.type,
      },
    })
    return updatedAccount
  },
}

const accountServices = {
  getAllByUser: (userId: string) => queries.getAccounts(userId),
  add: (userId: string, details: AccountDetails) =>
    mutations.addAccount(userId, details),
  delete: (userId: string, accountName: string) =>
    mutations.deleteAccount(userId, accountName),
  update: (userId: string, oldName: string, newDetails: AccountDetails) =>
    mutations.updateAccount(userId, oldName, newDetails),
}

export default accountServices
