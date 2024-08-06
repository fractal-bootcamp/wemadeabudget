import { TransactionDetails } from "./types";
import { Prisma } from "@prisma/client";
import prisma from "../client";
import { create } from "domain";

export async function createCategory(categoryName: string) {}

export async function postNewTransaction(
  transaction: TransactionDetails,
  username: string
) {
  try {
    const userId = (
      await prisma.user.findFirstOrThrow({
        where: {
          username: username
        },
        select: {
          id: true
        }
      })
    ).id;
    const postRes = await prisma.transaction.create({
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
          }
        },
        payee: {
          connect: {
            payeeId: {
              userId: userId,
              name: transaction.payee
            }
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
        flag: transaction.flag,
        account: {
          connect: {
            accountId: {
              userId: userId,
              name: transaction.account
            }
          }
        }
      }
    });
    return postRes;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          throw new Error("Username not found");
        default:
          throw error;
      }
    }
  }
}
