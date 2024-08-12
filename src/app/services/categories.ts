import { Prisma } from '@prisma/client'
import prisma from '../client'
import { CategoryDetails } from '../types'
const queries = {
  getCategories: async (userId: string) => {
    const categories = await prisma.category.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    })
    return categories
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
      return newCategory
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
    const deletedCategory = await prisma.category.delete({
      where: {
        categoryId: {
          name: categoryName,
          userId: userId,
        },
      },
    })
    return deletedCategory
  },
  updateCategory: async (
    userId: string,
    categoryUpdatePayload: CategoryUpdatePayload
  ) => {
    const updatedCategory = await prisma.category.update({
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
    return updatedCategory
  },
}
type CategoryUpdatePayload = {
  oldName: string
  newDetails: CategoryDetails
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
