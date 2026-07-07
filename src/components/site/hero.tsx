"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
  "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1600&q=80",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1600&q=80",
];

const ROTATING_WORDS = ["Authentic.", "Premium.", "Iconic.", "Collectible."];

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setSlide((s) => (s + 1) % HERO_IMAGES.length), 6000);
    const t2 = setInterval(() => setWord((w) => (w + 1) % ROTATING_WORDS.length), 2400);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-foreground">
      {/* Background images with crossfade */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover animate-ken-burns"
            fetchPriority="high"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28 pt-32">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-up">
            <span className="h-px w-10 bg-white/60" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/80">
              Kenya&apos;s Premium Sneaker Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-white font-semibold tracking-tightest text-5xl sm:text-6xl lg:text-8xl leading-[0.95] mb-6 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            Every brand.
            <br />
            <span className="text-white/70">Every drop.</span>
            <br />
            <span className="inline-flex items-baseline overflow-hidden h-[1.05em] align-bottom">
              <span key={word} className="animate-fade-in text-[var(--kenyan-red)]">
                {ROTATING_WORDS[word]}
              </span>
            </span>
          </h1>

          {/* Subhead */}
          <p
            className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mb-8 sm:mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            From Nike to New Balance, Yeezy to On Running — 25+ legendary brands,
            authenticated and delivered to your door across Kenya.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#product-grid"
              className="group inline-flex items-center justify-center gap-2 bg-white text-foreground px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors min-h-[48px]"
            >
              Shop the collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#brands"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-7 sm:px-8 py-3.5 sm:py-4 text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors min-h-[48px]"
            >
              Explore brands
            </a>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-4 sm:gap-6 mt-10 sm:mt-12 animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-white text-white"
                  />
                ))}
              </div>
              <span className="text-sm text-white/80">
                4.9 · 12,400+ reviews
              </span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="text-sm text-white/80 hidden sm:block">
              <span className="font-semibold text-white">25+</span> brands
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="text-sm text-white/80 hidden sm:block">
              <span className="font-semibold text-white">100%</span> authentic
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 right-4 sm:right-6 lg:right-8 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === slide ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
