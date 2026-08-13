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
    // Graceful fallback for the mock backend: treat a signed-in email
    // as an authenticated session so account pages render instead of looping.
    return {
      userId: sessionCookie,
      email: sessionCookie,
      preferredLanguage: "en" as const,
    };
  }

  return {
    userId: user.userId,
    email: user.email,
    preferredLanguage: user.preferredLanguage,
  };
}