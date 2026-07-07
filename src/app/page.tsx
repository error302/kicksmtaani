import { Suspense } from "react";
import { getAllBrands, getProductsByFilters } from "@/lib/queries";
import { HomeClient } from "@/components/site/home-client";
import { SiteHeader } from "@/components/site/site-header";
import { CartSheet } from "@/components/site/cart-sheet";
import { PageSkeleton } from "@/components/site/page-skeleton";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <HomeWithData />
        </Suspense>
      </main>
      <CartSheet />
    </>
  );
}

async function HomeWithData() {
  const [brands, products] = await Promise.all([
    getAllBrands(),
    getProductsByFilters({ limit: 200 }),
  ]);

  return <HomeClient brands={brands} products={products} />;
}
