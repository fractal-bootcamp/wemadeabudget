import { currentUser } from "@clerk/nextjs/server";
import prisma from "../client";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";

type ExtendedNextRequest = NextRequest & { user?: User };

export function userReqHandler(
  handler: (req: ExtendedNextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return handler(req as ExtendedNextRequest);
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    });

    if (user) {
      (req as ExtendedNextRequest).user = user;
    } else {
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            username: clerkUser.username ?? ""
          }
        });
        console.log("Successfully created new user in the database:", newUser);
        (req as ExtendedNextRequest).user = newUser;
      } catch (error) {
        console.error("Failed to create new user:", error);
        return NextResponse.json(
          { error: "Failed to create new user" },
          { status: 500 }
        );
      }
    }

    return handler(req as ExtendedNextRequest);
  };
}
