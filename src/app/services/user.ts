import prisma from '../client'
import { defaults } from '../types'
const queries = {
  findUserByClerkId: async (clerkId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    })
    return user
  },
}
const mutations = {
  /** Finds, updates, or adds a user using clerk id and optional email and username */
  upsertClerkUser: async (
    clerkId: string,
    email?: string,
    username?: string
  ) => {
    const user = await prisma.user.upsert({
      where: {
        clerkId: clerkId,
      },
      update: {
        email: email,
        username: username,
      },
      create: {
        clerkId: clerkId,
        email: email ?? '',
        username: username ?? '',
        accounts: {
          create: defaults.accounts,
        },
        categories: {
          create: [
            ...defaults.categories.map((name) => ({ name, allocated: 0 })),
            ...defaults.permanentCategories.map((name) => ({
              name,
              allocated: 0,
              permanent: true,
            })),
          ],
        },
        payees: {
          create: defaults.payees,
        },
      },
    })
    return user
  },
  removeUser: async (userId: string) => {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    })
    return deletedUser
  },
}
export const userServices = {
  /**returns database entry for a user from the clerk id */
  findByClerkId: async (clerkId: string) => {
    return await queries.findUserByClerkId(clerkId)
  },
  /** Adds/looksup/updates a user in the database using clerk id and optional email and username */
  upsertUserFromClerkDetails: async (
    clerkId: string,
    email: string,
    username: string
  ) => {
    return await mutations.upsertClerkUser(clerkId, email, username)
  },
  removeUser: async (userId: string) => {
    return await mutations.removeUser(userId)
  },
}
