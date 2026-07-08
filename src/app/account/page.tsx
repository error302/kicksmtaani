import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountClient } from "@/components/account/account-client";

export const metadata = { title: "My Account · KicksMtaani" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/account");

  const [orders, addresses] = await Promise.all([
    db.order.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
    }),
    db.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <AccountClient
      user={session.user as any}
      orders={orders.map((o) => ({ ...o, items: JSON.parse(o.items) }))}
      addresses={addresses}
    />
  );
}
