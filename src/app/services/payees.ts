import { Prisma } from "@prisma/client";
import prisma from "../client";

const queries = {
  /** Retrieve all payees for a user */
  getPayees: async (userId: string) => {
    const payees = await prisma.payee.findMany({
      where: {
        user: {
          id: userId
        }
      }
    });
    return payees;
  }
};

const mutations = {
  /** Add a specified payee to a user */
  addPayee: async (userId: string, name: string) => {
    const newPayee = await prisma.payee.create({
      data: {
        name: name,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return newPayee;
  },
  deletePayee: async (userId: string, payeeName: string) => {
    const deletedPayee = await prisma.payee.delete({
      where: {
        payeeId: {
          name: payeeName,
          userId: userId
        }
      }
    });
    return deletedPayee;
  },
  updatePayee: async (userId: string, oldName: string, newName: string) => {
    const updatedPayee = await prisma.payee.update({
      where: {
        payeeId: {
          name: oldName,
          userId: userId
        }
      },
      data: {
        name: newName
      }
    });
    return updatedPayee;
  }
};

const payeeServices = {
  getAllByUser: (userId: string) => queries.getPayees(userId),
  add: (userId: string, name: string) => mutations.addPayee(userId, name),
  delete: (userId: string, payeeName: string) =>
    mutations.deletePayee(userId, payeeName),
  update: (userId: string, oldName: string, newName: string) =>
    mutations.updatePayee(userId, oldName, newName)
};

export default payeeServices;
