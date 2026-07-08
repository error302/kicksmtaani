"use client";

import { useEffect, useMemo, useState } from "react";
import type { BrandDTO, ProductDTO, Category } from "@/lib/types";
import type { SiteSettings } from "@/lib/settings";
import { Hero } from "./hero";
import { BrandStrip } from "./brand-strip";
import { TrustBar } from "./trust-bar";
import { BrandShowcase } from "./brand-showcase";
import { Editorial } from "./editorial";
import { CategoryStrip } from "./category-strip";
import { FilterBar } from "./filter-bar";
import { ProductGrid } from "./product-grid";
import { ProductModal } from "./product-modal";
import { Newsletter } from "./newsletter";
import { SiteFooter } from "./site-footer";
import { WishlistSheet } from "./wishlist-sheet";
import { RecentlyViewed } from "./recently-viewed";
import { useWishlistStore } from "@/lib/wishlist-store";

interface Props {
  brands: BrandDTO[];
  products: ProductDTO[];
  settings: SiteSettings;
}

export function HomeClient({ brands, products, settings }: Props) {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [brandSlug, setBrandSlug] = useState<string>("");
  const [sort, setSort] = useState<string>("new");
  const [search, setSearch] = useState<string>("");

  const [activeProduct, setActiveProduct] = useState<ProductDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const trackView = useWishlistStore((s) => s.trackView);

  const brandOptions = useMemo(
    () => brands.map((b) => ({ slug: b.slug, name: b.name })),
    [brands]
  );

  useEffect(() => {
    if (activeProduct) {
      trackView(activeProduct.id);
    }
  }, [activeProduct, trackView]);

  const handleBrandSelect = (slug: string) => {
    setBrandSlug(slug);
    setTimeout(() => {
      document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleCategorySelect = (c: Category | "ALL") => {
    setCategory(c);
    setTimeout(() => {
      document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const openProduct = (p: ProductDTO) => {
    setActiveProduct(p);
    setModalOpen(true);
  };

  const navigateToProduct = (p: ProductDTO) => {
    setActiveProduct(p);
  };

  const clearFilters = () => {
    setCategory("ALL");
    setBrandSlug("");
    setSearch("");
    setSort("new");
  };

  return (
    <>
      <Hero settings={settings} />
      <BrandStrip />
      <TrustBar settings={settings} />
      <BrandShowcase brands={brands} onSelectBrand={handleBrandSelect} settings={settings} />
      <Editorial
        settings={settings}
        onShopNow={() =>
          document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <CategoryStrip activeCategory={category} onSelect={handleCategorySelect} />
      <FilterBar
        category={category}
        setCategory={setCategory}
        brandSlug={brandSlug}
        setBrandSlug={setBrandSlug}
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        brandOptions={brandOptions}
      />
      <ProductGrid
        products={products}
        category={category}
        brandSlug={brandSlug}
        sort={sort}
        search={search}
        onProductClick={openProduct}
        onClearFilters={clearFilters}
        settings={settings}
      />
      <RecentlyViewed products={products} onProductClick={openProduct} currency={settings.currency} />
      <Newsletter settings={settings} />
      <SiteFooter settings={settings} />

      <ProductModal
        product={activeProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        allProducts={products}
        onNavigateProduct={navigateToProduct}
        settings={settings}
      />
      <WishlistSheet products={products} onProductClick={openProduct} />
    </>
  );
}
