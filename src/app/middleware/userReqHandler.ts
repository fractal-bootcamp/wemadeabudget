import { currentUser } from "@clerk/nextjs/server";
import prisma from "../client";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";
import { dbAddUser } from "../actions/dbQueries";

export type ExtendedNextRequest = NextRequest & { userId: User["id"] };

export function userReqHandler(
  handler: (req: ExtendedNextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const newReq = req as ExtendedNextRequest;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("No clerk user found");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: {
        id: true
      }
    });

    if (user) {
      newReq.userId = user.id;
    } else {
      try {
        const details = {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          username: clerkUser.username ?? ""
        };
        const newUser = await dbAddUser(details);
        console.log("Successfully created new user in the database:", newUser);
        newReq.userId = newUser.id;
      } catch (error) {
        throw new Error("Failed to create new user in the database");
      }
    }

    return handler(newReq);
  };
}
