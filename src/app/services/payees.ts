import { Prisma } from '@prisma/client'
import prisma from '../client'
import { PayeeDetails } from '../types'
import { PayeeService } from './interfaces'
const selects = {
  name: true,
  accountTransfer: true,
}
const queries = {
  /** Retrieve all payees for a user */
  getAllByUserId: async (userId: string) => {
    const payees = await prisma.payee.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: selects,
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
      select: selects,
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
      select: selects,
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
      select: selects,
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
      select: selects,
    })
    return updatedPayee
  },
}

type PayeeUpdatePayload = {
  oldName: string
  newName: string
}

const payeeServices: PayeeService = {
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
