"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ShaderAnimation from "@/components/ui/shader-animation";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => getProducts({ limit: 8 }),
  });

  const products = productsData?.data || [];

  const heroSlides = [
    {
      title: "SNEAKROOM",
      subtitle: "Kenya's Premium Sneaker Destination",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      cta: "Shop Collection",
      link: "/products",
    },
    {
      title: "NEW ARRIVALS",
      subtitle: "Fresh Kicks Just Dropped",
      image:
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
      cta: "View Latest",
      link: "/products?sort=new",
    },
    {
      title: "NIKE AIR MAX",
      subtitle: "Iconic Comfort, Timeless Style",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      cta: "Explore",
      link: "/products?brand=Nike",
    },
  ];

  const categories = [
    {
      name: "Men",
      slug: "MEN",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    },
    {
      name: "Women",
      slug: "WOMEN",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    },
    {
      name: "Boys",
      slug: "BOYS",
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    },
    {
      name: "Girls",
      slug: "GIRLS",
      image:
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
    },
    {
      name: "Kids",
      slug: "KIDS",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9eb2fad643?w=400",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Shader Animated */}
      <ShaderAnimation className="h-screen">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            {/* Left - Text */}
            <div className="space-y-8">
              <div className="overflow-hidden">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white animate-slide-up">
                  {heroSlides[currentSlide].title.split("").map((char, i) => (
                    <span
                      key={i}
                      className="inline-block animate-letter"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 animate-fade-in">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex items-center gap-6 animate-fade-in-delayed">
                <Link
                  href={heroSlides[currentSlide].link}
                  className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg overflow-hidden"
                >
                  <span className="relative z-10">
                    {heroSlides[currentSlide].cta}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Slide Indicators */}
              <div className="flex gap-3 pt-4">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === currentSlide ? "w-12 bg-white" : "w-6 bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right - Animated Shoe */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square">
                {/* Rotating Ring */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-8 border border-red-500/20 rounded-full animate-spin-reverse" />

                {/* Shoe Image with Float Animation */}
                <div className="absolute inset-16 flex items-center justify-center">
                  <img
                    src={heroSlides[currentSlide].image}
                    alt="Featured Shoe"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl transform rotate-[-15deg] hover:rotate-0 hover:scale-110 transition-all duration-700 animate-float-image"
                  />
                </div>

                {/* Decorative Dots */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white/30 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </ShaderAnimation>

      {/* Marquee Brand Banner */}
      <section className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-white font-bold text-lg uppercase tracking-widest"
            >
              SneakRoom ✦ Kenya's Sneaker Hub ✦
            </span>
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Free Delivery</h4>
                <p className="text-sm text-gray-500">Nairobi & Mombasa</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">100% Authentic</h4>
                <p className="text-sm text-gray-500">Verified Originals</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">Easy Returns</h4>
                <p className="text-sm text-gray-500">7-Day Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Animated Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">
                Shop By Category
              </h2>
              <div className="w-20 h-1 bg-red-600 mt-2" />
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{cat.name}</h3>
                  <div className="w-0 group-hover:w-full h-0.5 bg-red-600 mt-2 transition-all duration-500" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight">
                New Drops
              </h2>
              <div className="w-20 h-1 bg-red-600 mt-2" />
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product: any, index: number) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <button className="w-full bg-white text-black py-3 rounded-full font-bold text-sm hover:bg-red-600 hover:text-white transition-colors">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-red-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                  <p className="text-red-500 font-bold text-lg">
                    KES {Number(product.basePrice).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Join The SneakRoom
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get exclusive drops, member-only prices, and early access to new
            arrivals. Subscribe now and never miss a release.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30"
            />
            <button className="px-8 py-4 bg-black rounded-full font-bold hover:bg-gray-900 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
