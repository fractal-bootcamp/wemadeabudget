import prisma from "../client";
interface CategoryDetails {
    name: string;
    categoryGroupName: string;
}
const mutations = {
    findOrCreateCategory: async (details: CategoryDetails, userId: string) => {
        const category = await prisma.category.upsert({
            where: {
                categoryId: {
                    userId: userId,
                    name: details.name
                }
            },
            create: {
                name: details.name,
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