"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
  onShopNow: () => void;
}

export function Editorial({ onShopNow }: Props) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-foreground text-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-background/40" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-background/60">
                The KicksMtaani Standard
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.95] mb-6">
              Not just shoes.
              <br />
              <span className="text-background/50">A statement.</span>
            </h2>
            <p className="text-base sm:text-lg text-background/70 leading-relaxed mb-5 max-w-lg">
              KicksMtaani was born from a simple conviction: that Kenyan
              sneakerheads deserve the same access to global heat as anyone,
              anywhere — without compromise on authenticity, delivery, or service.
            </p>
            <p className="text-base sm:text-lg text-background/70 leading-relaxed mb-8 max-w-lg">
              Every pair in our catalogue is sourced through authorised channels,
              inspected by hand, and shipped from Nairobi. From the icons of
              Beaverton to the trail-ready technicality of the French Alps, we
              carry the brands that matter.
            </p>
            <button
              onClick={onShopNow}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide border-b border-background pb-1 hover:border-[var(--kenyan-red)] hover:text-[var(--kenyan-red)] transition-colors"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Right — image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="aspect-[3/4] overflow-hidden bg-background/5">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80"
                alt="Sneaker editorial 1"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden bg-background/5 mt-8 sm:mt-12">
              <img
                src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&q=80"
                alt="Sneaker editorial 2"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square overflow-hidden bg-background/5 -mt-4">
              <img
                src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80"
                alt="Sneaker editorial 3"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square overflow-hidden bg-background/5 mt-4">
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80"
                alt="Sneaker editorial 4"
                loading="lazy"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
