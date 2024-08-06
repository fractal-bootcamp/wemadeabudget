import { TransactionDetails } from "./types";
import { Prisma } from "@prisma/client";
import prisma from "../client";

export async function createCategory (categoryName: string) {
    
interface TransactionPayload {
    TransactionDetails: TransactionDetails;
    username: string;
}

export async function postNewTransaction( payload: TransactionPayload ) {
    try {
        const userId = (await prisma.user.findFirstOrThrow({
        where: {
            username: payload.username,
        },
        select: {
            id: true,
        }
    })).id;
    const postRes = await prisma.transaction.create({
        
        data: {
            date: payload.TransactionDetails.date,
            cents: payload.TransactionDetails.cents,
            memo: payload.TransactionDetails.memo,
            category: {
                connect: {
                    categoryId: {
                        userId: userId,
                        name: payload.TransactionDetails.category,
                    }
                }
            },
            payee: {
                connect: {
                    payeeId: {
                        userId: userId,
                        name: payload.TransactionDetails.payee,
                    }
                }
            },
            user: {
                connect: {
                    username: userId,
                }
            },
                flag: payload.TransactionDetails.flag,
            user: {
                connect: {
                    username: userId,
                }
            },
            account: {
                connect: {
                    accountId: {
                        userId: userId,
                        name: payload.TransactionDetails.account,
                    }
                }
            },
    
        }
    });
} catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2025":
                throw new Error("Username not found");
            default:
                throw error;
        }
}}
