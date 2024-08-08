import { currentUser } from "@clerk/nextjs/server";
import { userServices } from "../services/user";
/** Queries the current clerk context and returns authenticated status and database user info (or adds it if it doesn't exist) */
export default async function clerkHandler() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { authenticated: false, user: null };
  }
  //retrieve or add the currentUser to the database
  const email =
    clerkUser.emailAddresses.length > 0
      ? clerkUser.emailAddresses[0].emailAddress
      : "";
  const username = clerkUser.username ?? "";
  const userInDb = await userServices.upsertUserFromClerkDetails(
    clerkUser.id,
    email,
    username
  );
  return { authenticated: true, user: userInDb };
}
