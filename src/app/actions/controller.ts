'use server'
import clerkHandler from '../middleware/clerkHandler'
import categoryServices from '../services/categories'
import payeeServices from '../services/payees'
import transactionServices from '../services/transactions'
import accountServices from '../services/accounts'

type CallbackWithPayload<T, R> = (userId: string, payload: T) => Promise<R>
type CallbackWithoutPayload<R> = (userId: string) => Promise<R>

function attachUserId<R>(callback: CallbackWithoutPayload<R>): () => Promise<R>
function attachUserId<T, R>(
  callback: CallbackWithPayload<T, R>
): (payload: T) => Promise<R>
function attachUserId<T, R>(
  callback: CallbackWithPayload<T, R> | CallbackWithoutPayload<R>
) {
  return async (payload?: T): Promise<R> => {
    // get the userId from the clerk context
    const { authenticated, user } = await clerkHandler()
    if (!authenticated || user === null) {
      throw new Error('User is not authenticated')
    }
    // call the db function with the userId and the payload if provided
    if (payload !== undefined) {
      return await (callback as CallbackWithPayload<T, R>)(user.id, payload)
    } else {
      return await (callback as CallbackWithoutPayload<R>)(user.id)
    }
  }
}

const clientController = {
  transaction: {
    add: attachUserId(transactionServices.add),
    addTransfer: attachUserId(transactionServices.addTransfer),
    delete: attachUserId(transactionServices.delete),
    deleteTransfer: attachUserId(transactionServices.deleteTransfer),
    update: attachUserId(transactionServices.update),
    updateTransfer: attachUserId(transactionServices.updateTransfer),
    getById: attachUserId(transactionServices.getById),
    getAllByUser: attachUserId(transactionServices.getAllByUser),
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
    update: attachUserId(payeeServices.update),
    getAllByUser: attachUserId(payeeServices.getAllByUser),
  },
  account: {
    add: attachUserId(accountServices.add),
    delete: attachUserId(accountServices.delete),
    update: attachUserId(accountServices.update),
    getAllByUser: attachUserId(accountServices.getAllByUser),
  },
}

export const dbTransactionAdd = clientController.transaction.add
export const dbTransactionAddTransfer = clientController.transaction.addTransfer
export const dbTransactionDelete = clientController.transaction.delete
export const dbTransactionGetById = clientController.transaction.getById
export const dbTransactionGetAllByUser =
  clientController.transaction.getAllByUser
export const dbTransactionUpdate = clientController.transaction.update
export const dbTransactionUpdateTransfer =
  clientController.transaction.updateTransfer
export const dbTransactionGetByCategory =
  clientController.transaction.getByCategory
export const dbTransactionGetByPayee = clientController.transaction.getByPayee
export const dbTransactionGetByAccount =
  clientController.transaction.getByAccount

export const dbCategoryAdd = clientController.category.add
export const dbCategoryDelete = clientController.category.delete
export const dbCategoryGetAllByUser = clientController.category.getAllByUser
export const dbCategoryUpdate = clientController.category.update

export const dbPayeeAdd = clientController.payee.add
export const dbPayeeDelete = clientController.payee.delete
export const dbPayeeGetAllByUser = clientController.payee.getAllByUser
export const dbPayeeUpdate = clientController.payee.update

export const dbAccountAdd = clientController.account.add
export const dbAccountDelete = clientController.account.delete
export const dbAccountGetAllByUser = clientController.account.getAllByUser
export const dbAccountUpdate = clientController.account.update
