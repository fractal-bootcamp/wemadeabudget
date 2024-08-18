import { Prisma } from '@prisma/client'
import prisma from '../client'
import { PayeeDetails } from '../types'

const queries = {
  /** Retrieve all payees for a user */
  getAllByUserId: async (userId: string) => {
    const payees = await prisma.payee.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    })
    return payees
  },
  getByName: async (userId: string, payeeName: string) => {
    const payee = await prisma.payee.findUnique({
      where: {
        payeeId: {
          name: payeeName,
          userId: userId,
        },
      },
      select: { name: true, accountTransfer: true },
    })
    return payee
  },
}

const mutations = {
  /** Add a specified payee to a user */
  add: async (userId: string, payee: PayeeDetails) => {
    const newPayee = await prisma.payee.create({
      data: {
        name: payee.name,
        accountTransfer: payee.accountTransfer,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    return newPayee
  },
  delete: async (userId: string, payeeName: string) => {
    const deletedPayee = await prisma.payee.delete({
      where: {
        payeeId: {
          name: payeeName,
          userId: userId,
        },
      },
    })
    return deletedPayee
  },
  update: async (userId: string, payeeUpdatePayload: PayeeUpdatePayload) => {
    const updatedPayee = await prisma.payee.update({
      where: {
        payeeId: {
          name: payeeUpdatePayload.oldName,
          userId: userId,
        },
      },
      data: {
        name: payeeUpdatePayload.newName,
      },
    })
    return updatedPayee
  },
}

type PayeeUpdatePayload = {
  oldName: string
  newName: string
}

const payeeServices = {
  getAllByUser: (userId: string) => queries.getAllByUserId(userId),
  getByName: (userId: string, payeeName: string) =>
    queries.getByName(userId, payeeName),
  add: (userId: string, newPayee: PayeeDetails) =>
    mutations.add(userId, newPayee),
  delete: (userId: string, payeeName: string) =>
    mutations.delete(userId, payeeName),
  update: (userId: string, payeeUpdatePayload: PayeeUpdatePayload) =>
    mutations.update(userId, payeeUpdatePayload),
}

export default payeeServices
