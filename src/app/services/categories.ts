import { Prisma } from "@prisma/client";
import prisma from "../client";
import { CategoryDetails } from "../types";
const queries = {
  getCategories: async (userId: string) => {
    const categories = await prisma.category.findMany({
      where: {
        user: {
          id: userId
        }
      }
    });
    return categories;
  }
};

const mutations = {
  addCategory: async (userId: string, details: CategoryDetails) => {
    try {
      const newCategory = await prisma.category.create({
        data: {
          name: details.name,
          user: {
            connect: {
              id: userId
            }
          },
          allocated: 0
        }
      });
      return newCategory;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          "A category with this name already exists for this user."
        );
      }
      throw error; // Re-throw other errors
    }
  },
  deleteCategory: async (userId: string, categoryName: string) => {
    const deletedCategory = await prisma.category.delete({
      where: {
        categoryId: {
          name: categoryName,
          userId: userId
        }
      }
    });
    return deletedCategory;
  },
  updateCategory: async (userId: string, details: CategoryDetails) => {
    const updatedCategory = await prisma.category.update({
      where: {
        categoryId: {
          name: details.name,
          userId: userId
        }
      },
      data: {
        name: details.name,
        allocated: details.allocated
      }
    });
    return updatedCategory;
  }
};
const categoryServices = {
  getAllByUser: (userId: string) => queries.getCategories(userId),
  add: (userId: string, details: CategoryDetails) =>
    mutations.addCategory(userId, details),
  delete: (userId: string, categoryName: string) =>
    mutations.deleteCategory(userId, categoryName),
  update: (userId: string, details: CategoryDetails) =>
    mutations.updateCategory(userId, details)
};

export default categoryServices;
