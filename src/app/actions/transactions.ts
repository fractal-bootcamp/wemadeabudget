const queries = {
    const createTransaction = async (transaction: TransactionDetails, userId: string) => {
        const newTransaction = await prisma.transaction.create({
            data: {
}
const mutations = {
const transactionServive = {
    addTransaction: async (transaction: TransactionDetails, userId: string) => {
        const categoryId = await prisma.category.upsert()
}