import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }
  return session;
}
