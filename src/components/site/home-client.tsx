"use client";

import { useMemo, useState } from "react";
import type { BrandDTO, ProductDTO, Category } from "@/lib/types";
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

interface Props {
  brands: BrandDTO[];
  products: ProductDTO[];
}

export function HomeClient({ brands, products }: Props) {
  // Filter state
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [brandSlug, setBrandSlug] = useState<string>("");
  const [sort, setSort] = useState<string>("new");
  const [search, setSearch] = useState<string>("");

  // Modal state
  const [activeProduct, setActiveProduct] = useState<ProductDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const brandOptions = useMemo(
    () => brands.map((b) => ({ slug: b.slug, name: b.name })),
    [brands]
  );

  const handleBrandSelect = (slug: string) => {
    setBrandSlug(slug);
    // smooth scroll to grid
    setTimeout(() => {
      document
        .getElementById("product-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleCategorySelect = (c: Category | "ALL") => {
    setCategory(c);
    setTimeout(() => {
      document
        .getElementById("product-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const openProduct = (p: ProductDTO) => {
    setActiveProduct(p);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setCategory("ALL");
    setBrandSlug("");
    setSearch("");
    setSort("new");
  };

  return (
    <>
      <Hero />
      <BrandStrip />
      <TrustBar />
      <BrandShowcase brands={brands} onSelectBrand={handleBrandSelect} />
      <Editorial onShopNow={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })} />
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
      />
      <Newsletter />
      <SiteFooter />

      <ProductModal
        product={activeProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
