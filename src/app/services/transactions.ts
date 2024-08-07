import prisma from "../client"
import { TransactionDetails } from "../types"

const queries = {
    getTransactions: async (userId: string) => {
        return await prisma.transaction.findMany({
            where: {
                userId: userId
            }
        })
    },

}
const mutations = {
    addTransaction: async (transaction: TransactionDetails, userId: string) => {
        const newTransaction = await prisma.transaction.create({
            data: {
                date: transaction.date,
                cents: transaction.cents,
                memo: transaction.memo,
                category: {
                    connectOrCreate: {
                        where: {
                            categoryId: {
                                userId: userId,
                                name: transaction.category
                            }
                        },
                        create: {
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                            name: transaction.category
}
const transactionServices    = {
    addTransaction: async (transaction: TransactionDetails, userId: string) => {
        const categoryId = await categor
}