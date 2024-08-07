import prisma from "../client";

const mutations = {
    upsertCategory: async (details: CategoryDetails, userId: string) => {
        const category = await prisma.category.upsert({
            where: {
                categoryId: {
                    userId: userId,
                    name: details.name
                }
            },
            create: {
                name: details.name,
                categoryGroupId: {
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
        });
}
const categoryService = {

}