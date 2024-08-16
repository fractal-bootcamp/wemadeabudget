import prisma from '../client'
import { defaults, UserUpdatePayload } from '../types'
import accountServices from './accounts'
const queries = {
  findUserByClerkId: async (clerkId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      select: {
        id: true,
      },
    })
    return user
  },
}
const mutations = {
  /** Finds, updates, or adds a user using clerk id and optional email and username */
  addByClerkId: async (clerkId: string, email: string, username: string) => {
    const user = await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        username: username,
        accounts: {},
        categories: {
          create: defaults.categories,
        },
        payees: {
          create: defaults.payees,
        },
      },
    })
    return user
  },
  updateById: async (
    userId: string,
    { email, username }: UserUpdatePayload
  ) => {
    const data: any = {}
    if (email !== undefined) data.email = email
    if (username !== undefined) data.username = username

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
    })
    return updatedUser
  },
  delete: async (userId: string) => {
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
  addOrFetchUserFromClerkId: async (
    clerkId: string,
    email: string,
    username: string
  ) => {
    //are we creating a new user?
    const existingUser = await queries.findUserByClerkId(clerkId)
    //if user exists, just return the user object
    if (existingUser) return existingUser
    //
    const newUser = await mutations.addByClerkId(clerkId, email, username)
    //add default accounts (and transfer payees) if we are creating a new user
    const newAccounts = defaults.accounts.map((account) =>
      accountServices.add(newUser.id, account)
    )
    //add default accounts (and transfer payees)
    return newUser
  },
  deleteUser: async (userId: string) => {
    return await mutations.delete(userId)
  },
}
