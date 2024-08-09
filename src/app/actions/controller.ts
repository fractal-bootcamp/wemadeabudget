'use server'
import clerkHandler from '../middleware/clerkHandler'
import categoryServices from '../services/categories'
import payeeServices from '../services/payees'
import transactionServices from '../services/transactions'
import accountServices from '../services/accounts'

const attachUserId =
  <T extends any[], R>(callback: (userId: string, ...args: T) => Promise<R>) =>
  async (...details: T): Promise<R> => {
    const { authenticated, user } = await clerkHandler()
    if (!authenticated || user === null) {
      throw new Error('User is not authenticated')
    }
    return await callback(user.id, ...details)
  }

const clientController = {
  transaction: {
    add: attachUserId(transactionServices.add),
    delete: attachUserId(transactionServices.delete),
    getById: attachUserId(transactionServices.getById),
    getAllByUser: attachUserId(transactionServices.getAllByUser),
    update: attachUserId(transactionServices.update),
    getByCategory: attachUserId(transactionServices.getByCategory),
    getByPayee: attachUserId(transactionServices.getByPayee),
    getByAccount: attachUserId(transactionServices.getByAccount),
  },
  category: {
    add: attachUserId(categoryServices.add),
    delete: attachUserId(categoryServices.delete),
    getAllByUser: attachUserId(categoryServices.getAllByUser),
    update: attachUserId(categoryServices.update),
  },
  payee: {
    add: attachUserId(payeeServices.add),
    delete: attachUserId(payeeServices.delete),
    getAllByUser: attachUserId(payeeServices.getAllByUser),
    update: attachUserId(payeeServices.update),
  },
  account: {
    add: attachUserId(accountServices.add),
    delete: attachUserId(accountServices.delete),
    getAllByUser: attachUserId(accountServices.getAllByUser),
    update: attachUserId(accountServices.update),
  },
}

export const transactionAdd = clientController.transaction.add
export const transactionDelete = clientController.transaction.delete
export const transactionGetById = clientController.transaction.getById
export const transactionGetAllByUser = clientController.transaction.getAllByUser
export const transactionUpdate = clientController.transaction.update
export const transactionGetByCategory =
  clientController.transaction.getByCategory
export const transactionGetByPayee = clientController.transaction.getByPayee
export const transactionGetByAccount = clientController.transaction.getByAccount

export const categoryAdd = clientController.category.add
export const categoryDelete = clientController.category.delete
export const categoryGetAllByUser = clientController.category.getAllByUser
export const categoryUpdate = clientController.category.update

export const payeeAdd = clientController.payee.add
export const payeeDelete = clientController.payee.delete
export const payeeGetAllByUser = clientController.payee.getAllByUser
export const payeeUpdate = clientController.payee.update

export const accountAdd = clientController.account.add
export const accountDelete = clientController.account.delete
export const accountGetAllByUser = clientController.account.getAllByUser
export const accountUpdate = clientController.account.update
