import { getAllBrands, getProductsByFilters } from "@/lib/queries";
import { HomeClient } from "@/components/site/home-client";
import { SiteHeader } from "@/components/site/site-header";
import { CartSheet } from "@/components/site/cart-sheet";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [brands, products] = await Promise.all([
    getAllBrands(),
    getProductsByFilters({ limit: 100 }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeClient brands={brands} products={products} />
      </main>
      <CartSheet />
    </>
  );
}
