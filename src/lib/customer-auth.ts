import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/data/users";

export async function getCustomerAuth(cookieValue?: string) {
  let sessionCookie: string | undefined;

  if (cookieValue !== undefined) {
    sessionCookie = cookieValue;
  } else {
    const cookieStore = await cookies();
    sessionCookie = cookieStore.get("session")?.value;
  }

  if (!sessionCookie) {
    return null;
  }

  const user = await getUserByEmail(sessionCookie);
  if (!user) {
    return null;
  }

  return {
    userId: user.userId,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
  };
}
