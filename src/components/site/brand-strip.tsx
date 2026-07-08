"use client";

const ITEMS = [
  "Nike", "Adidas", "Jordan", "Yeezy", "New Balance", "On Running",
  "Salomon", "Travis Scott", "Off-White", "Balenciaga", "Sacai",
  "Alexander McQueen", "Hoka", "ASICS", "Vans", "Converse",
];

export function BrandStrip() {
  return (
    <section
      aria-label="Featured brands"
      className="bg-foreground text-background py-3.5 overflow-hidden border-y border-background/10"
    >
      <div className="flex whitespace-nowrap animate-marquee-x">
        {[...ITEMS, ...ITEMS].map((b, i) => (
          <span
            key={i}
            className="mx-6 sm:mx-8 text-sm sm:text-base font-medium tracking-[0.15em] uppercase text-background/80 flex items-center gap-6"
          >
            {b}
            <span className="text-[var(--kenyan-red)]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
