//extend the NextApiRequest interface to include a User type from our prisma client
import { User } from "@prisma/client";
import { NextRequest as OriginalNextRequest } from "next/server";
declare global {
  declare interface NextRequest extends OriginalNextRequest {
    user?: User;
  }
}
