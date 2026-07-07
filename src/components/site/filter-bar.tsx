"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Category } from "@/lib/types";

interface Props {
  category: Category | "ALL";
  setCategory: (c: Category | "ALL") => void;
  brandSlug: string;
  setBrandSlug: (b: string) => void;
  sort: string;
  setSort: (s: string) => void;
  search: string;
  setSearch: (s: string) => void;
  brandOptions: { slug: string; name: string }[];
}

const CATEGORIES: { id: Category | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "MEN", label: "Men" },
  { id: "WOMEN", label: "Women" },
  { id: "UNISEX", label: "Unisex" },
  { id: "KIDS", label: "Kids" },
];

const SORTS = [
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price · Low to High" },
  { id: "price-desc", label: "Price · High to Low" },
  { id: "rating", label: "Top Rated" },
];

export function FilterBar({
  category,
  setCategory,
  brandSlug,
  setBrandSlug,
  sort,
  setSort,
  search,
  setSearch,
  brandOptions,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="sticky top-14 sm:top-16 lg:top-20 z-30 bg-background/90 header-blur border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-12 sm:h-14">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sneakers, brands..."
              className="w-full h-9 sm:h-10 pl-9 pr-9 text-sm bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort (desktop) */}
          <div ref={sortRef} className="relative hidden sm:block">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="inline-flex items-center gap-2 h-9 sm:h-10 px-4 text-sm font-medium hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground">Sort:</span>
              {SORTS.find((s) => s.id === sort)?.label ?? "Newest"}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-background border border-border shadow-lg py-1 z-50">
                {SORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      sort === s.id ? "font-semibold" : ""
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand select (desktop) */}
          <select
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            className="hidden sm:block h-9 sm:h-10 px-3 text-sm bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            aria-label="Filter by brand"
          >
            <option value="">All brands</option>
            {brandOptions.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-x pb-3 -mx-1 px-1 sm:pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex-shrink-0 h-9 px-4 text-xs sm:text-sm font-medium border transition-all min-h-[36px] ${
                category === c.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
