import clerkHandler from "../middleware/clerkHandler";
import categoryServices from "../services/categories";
import payeeServices from "../services/payees";
import transactionServices from "../services/transactions";

const attachUserId =
  <T extends any[], R>(callback: (userId: string, ...args: T) => Promise<R>) =>
  async (...details: T): Promise<R> => {
    const { authenticated, user } = await clerkHandler();
    if (!authenticated || user === null) {
      throw new Error("User is not authenticated");
    }
    return await callback(user.id, ...details);
  };

export const clientController = {
  transaction: {
    add: attachUserId(transactionServices.add),
    delete: attachUserId(transactionServices.delete),
    getById: attachUserId(transactionServices.getById),
    getAllByUser: attachUserId(transactionServices.getAllByUser),
    update: attachUserId(transactionServices.update),
    getByCategory: attachUserId(transactionServices.getByCategory)
  },
  category: {
    add: attachUserId(categoryServices.add),
    delete: attachUserId(categoryServices.delete),
    getAllByUser: attachUserId(categoryServices.getAllByUser),
    update: attachUserId(categoryServices.update)
  },
  payee: {
    add: attachUserId(payeeServices.add),
    delete: attachUserId(payeeServices.delete),
    getAllByUser: attachUserId(payeeServices.getAllByUser),
    update: attachUserId(payeeServices.update)
  },
  account: {}
};
