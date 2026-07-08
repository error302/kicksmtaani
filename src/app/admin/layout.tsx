import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin · KicksMtaani",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin");
  }
  return <AdminShell user={session.user as any}>{children}</AdminShell>;
}
