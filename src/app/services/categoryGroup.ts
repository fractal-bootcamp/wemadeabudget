import { get } from "http";
import prisma from "../client";

const mutations = {
  /** Create or find existing category group */
  createCategoryGroup: (categoryGroupName: string, userId: string) => {
    const newCategoryGroup = prisma.categoryGroup.upsert({
      where: {
        categoryGroupId: {
          userId: userId,
          name: categoryGroupName
        }
      },
      create: {
        name: categoryGroupName,
        userId: userId
      },
      update: {}
    });
    return newCategoryGroup;
  },
  deleteCategoryGroup: (categoryGroupName: string, userId: string) => {
    const deletedCategoryGroup = prisma.categoryGroup.delete({
      where: {
        categoryGroupId: {
          userId: userId,
          name: categoryGroupName
        }
      }
    });
    return deletedCategoryGroup;
  }
};

const queries = {
  /**Get all category groups for a user */
  getCategoryGroups: (userId: string) => {
    return prisma.categoryGroup.findMany({
      where: {
        userId: userId
      }
    });
  },
  /** Get the names of all categories in a user's category group */
  getCategoryGroupCategories: (categoryGroupName: string, userId: string) => {
    return prisma.categoryGroup.findUnique({
      where: {
        categoryGroupId: {
          userId: userId,
          name: categoryGroupName
        }
      },
      select: {
        categories: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
  }
};
const categoryGroupService = {};
export default categoryGroupService;
