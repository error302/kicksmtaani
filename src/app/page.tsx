import { Suspense } from "react";
import { getAllBrands, getProductsByFilters } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { HomeClient } from "@/components/site/home-client";
import { SiteHeader } from "@/components/site/site-header";
import { CartSheet } from "@/components/site/cart-sheet";
import { PageSkeleton } from "@/components/site/page-skeleton";
import { AnnouncementBar } from "@/components/site/announcement-bar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSettings();

  return (
    <>
      {settings.announcementActive && settings.announcementText && (
        <AnnouncementBar text={settings.announcementText} link={settings.announcementLink} />
      )}
      <SiteHeader settings={settings} />
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <HomeWithData settings={settings} />
        </Suspense>
      </main>
      <CartSheet settings={settings} />
    </>
  );
}

async function HomeWithData({ settings }: { settings: Awaited<ReturnType<typeof getSettings>> }) {
  const [brands, products] = await Promise.all([
    getAllBrands(),
    getProductsByFilters({ limit: 200 }),
  ]);

  return <HomeClient brands={brands} products={products} settings={settings} />;
}
