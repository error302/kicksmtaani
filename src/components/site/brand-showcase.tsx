"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BrandDTO } from "@/lib/types";
import type { SiteSettings } from "@/lib/settings";

interface Props {
  brands: BrandDTO[];
  onSelectBrand: (slug: string) => void;
  settings: SiteSettings;
}

export function BrandShowcase({ brands, onSelectBrand, settings: s }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="brands" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14 lg:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-foreground/40" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {s.brandsEyebrow}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.95]">
              {s.brandsTitle1}
              <br />
              <span className="text-muted-foreground">{s.brandsTitle2}</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm sm:text-base text-muted-foreground leading-relaxed">
            {s.brandsDescription}
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
          {brands.map((brand, idx) => (
            <motion.button
              key={brand.id}
              onClick={() => onSelectBrand(brand.slug)}
              onMouseEnter={() => setHovered(brand.id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.025, 0.4) }}
              className="group relative bg-background hover:bg-foreground transition-colors duration-500 p-8 sm:p-10 lg:p-12 text-left min-h-[160px] sm:min-h-[200px] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-display text-foreground group-hover:text-background transition-colors">
                    {brand.name}
                  </h3>
                  {brand.country && (
                    <p className="text-xs uppercase tracking-[0.18em] mt-1.5 text-muted-foreground group-hover:text-background/60 transition-colors">
                      {brand.country}
                    </p>
                  )}
                </div>
                {brand.featured && (
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 bg-[var(--kenyan-red)]/10 text-[var(--kenyan-red)] group-hover:bg-background/10 group-hover:text-background transition-colors">
                    Featured
                  </span>
                )}
              </div>

              <p
                className={`text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover:text-background/70 transition-all duration-500 ${
                  hovered === brand.id ? "opacity-100 max-h-24" : "opacity-0 max-h-0 sm:opacity-100 sm:max-h-24"
                } overflow-hidden`}
              >
                {brand.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
