import { Prisma } from '@prisma/client'
import prisma from '../client'
import { CategoryDetails, CategoryUpdatePayload } from '../types'
import { CategoryService } from './interfaces'
const selects = {
  name: true,
  allocated: true,
  permanent: true,
}
const queries = {
  getCategories: async (userId: string) => {
    return await prisma.category.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    })
  },
}

const mutations = {
  addCategory: async (userId: string, category: CategoryDetails) => {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        user: {
          connect: {
            id: userId,
          },
        },
        allocated: category.allocated || 0,
      },
      select: selects,
    })
    return newCategory
  },
  deleteCategory: async (userId: string, categoryName: string) => {
    const permanent = (
      await prisma.category.findUnique({
        where: {
          categoryId: {
            name: categoryName,
            userId: userId,
          },
        },
        select: {
          permanent: true,
        },
      })
    )?.permanent
    if (permanent) {
      throw new Error('Cannot delete a permanent category.')
    }
    // Upsert the Uncategorized category
    const uncategorizedCategory = await prisma.category.upsert({
      where: {
        categoryId: {
          name: 'Uncategorized',
          userId: userId,
        },
      },
      update: {}, // No updates needed if it exists
      create: {
        name: 'Uncategorized',
        userId: userId,
        allocated: 0,
      },
    })
    //Move all transactions in the category to the Uncategorized category
    //get all existing transactions in the to-be-deleted category
    const categoryTransactions = await prisma.transaction.findMany({
      where: {
        category: {
          name: categoryName,
          userId: userId,
        },
      },
    })
    //loop through and move to uncategorized
    const movedTransactions = await Promise.all(
      categoryTransactions.map((transaction) =>
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            category: {
              connect: {
                id: uncategorizedCategory.id,
              },
            },
          },
        })
      )
    )
    const movedTransactionIds = movedTransactions.map(
      (transaction) => transaction.id
    )

    // Then, delete the category
    const deletedCategory = await prisma.category.delete({
      where: {
        categoryId: {
          name: categoryName,
          userId: userId,
        },
      },
      select: selects,
    })
    return deletedCategory
  },
  updateCategory: async (
    userId: string,
    categoryUpdatePayload: CategoryUpdatePayload
  ) => {
    return await prisma.category.update({
      where: {
        categoryId: {
          name: categoryUpdatePayload.oldName,
          userId: userId,
        },
      },
      data: {
        name: categoryUpdatePayload.newDetails.name,
        allocated: categoryUpdatePayload.newDetails.allocated,
      },
    })
  },
}

const categoryServices: CategoryService = {
  getAllByUser: (userId: string) => queries.getCategories(userId),
  add: (userId: string, newCategory: CategoryDetails) =>
    mutations.addCategory(userId, newCategory),
  delete: (userId: string, categoryName: string) =>
    mutations.deleteCategory(userId, categoryName),
  update: (userId: string, categoryUpdatePayload: CategoryUpdatePayload) =>
    mutations.updateCategory(userId, categoryUpdatePayload),
}

export default categoryServices
