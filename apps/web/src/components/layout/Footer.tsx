"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-6xl font-black tracking-tighter mb-8 leading-tight">
              KEEP YOUR KICKS <br />
              <span className="text-red-600">FRESH.</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-md mb-8">
              Kenya&apos;s premium destination for authentic sneakers and streetwear. 
              Nairobi & Mombasa same-day delivery.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-red-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-red-600 transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-red-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Join the Club</h3>
            <p className="text-gray-400 mb-8">Get 10% off your first order and early access to drops.</p>
            <form className="flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/10 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 transition-all"
              />
              <button className="bg-white text-black p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 pt-20 border-t border-white/10">
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products?category=MEN" className="hover:text-red-600 transition-colors">Men&apos;s Collection</Link></li>
              <li><Link href="/products?category=WOMEN" className="hover:text-red-600 transition-colors">Women&apos;s Collection</Link></li>
              <li><Link href="/products?category=KIDS" className="hover:text-red-600 transition-colors">Kids & Toddlers</Link></li>
              <li><Link href="/products?brand=Nike" className="hover:text-red-600 transition-colors">Nike Originals</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-red-600 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-red-600 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-red-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-red-600" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-600" />
                info@kicksmtaani.co.ke
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-600" />
                +254 700 000 000
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
          <p>© {currentYear} KicksMtaani. Developed for the SneakRoom community.</p>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6 grayscale opacity-50" />
            <div className="flex gap-4">
              <div className="w-8 h-5 bg-gray-800 rounded-sm" />
              <div className="w-8 h-5 bg-gray-800 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
