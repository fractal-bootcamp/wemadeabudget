import { Prisma } from '@prisma/client'
import prisma from '../client'
import { CategoryDetails, CategoryUpdatePayload } from '../types'
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
  addCategory: async (userId: string, name: string) => {
    try {
      const newCategory = await prisma.category.create({
        data: {
          name: name,
          user: {
            connect: {
              id: userId,
            },
          },
          allocated: 0,
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new Error(
          'A category with this name already exists for this user.'
        )
      }
      throw error // Re-throw other errors
    }
  },
  deleteCategory: async (userId: string, categoryName: string) => {
    const permanent = await prisma.category.findUnique({
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
    await prisma.transaction.updateMany({
      where: {
        category: {
          name: categoryName,
          userId: userId,
        },
      },
      data: {
        categoryId: uncategorizedCategory.id,
      },
    })

    // Then, delete the category
    const deletedCategory = await prisma.category.delete({
      where: {
        categoryId: {
          name: categoryName,
          userId: userId,
        },
      },
    })
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

const categoryServices = {
  getAllByUser: (userId: string) => queries.getCategories(userId),
  add: (userId: string, name: string) => mutations.addCategory(userId, name),
  delete: (userId: string, categoryName: string) =>
    mutations.deleteCategory(userId, categoryName),
  update: (userId: string, categoryUpdatePayload: CategoryUpdatePayload) =>
    mutations.updateCategory(userId, categoryUpdatePayload),
}

export default categoryServices
