"use client";

import { useState } from "react";
import { Plus, Minus, Search, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are your sneakers authentic?",
      a: "Absolutely. Every pair at KicksMtaani is verified by our experts. We only stock authentic products from authorized distributors."
    },
    {
      q: "How long does delivery take?",
      a: "For Nairobi and Mombasa, we offer same-day or next-day delivery. Other parts of Kenya typically take 2-3 business days."
    },
    {
      q: "What payment methods do you accept?",
      a: "We primarily accept M-Pesa (STK Push) and all major Credit/Debit cards (Visa, Mastercard)."
    },
    {
      q: "Can I return my shoes if they don't fit?",
      a: "Yes, we have a 7-day return policy for unworn items in their original packaging. Please check our shipping page for more details."
    },
    {
      q: "Do you have a physical store?",
      a: "Yes! We are located in Nairobi CBD. You can visit us to try on your favorite kicks before buying."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black uppercase tracking-tight mb-4">Common <span className="text-red-600">Questions.</span></h1>
          <p className="text-gray-500 text-lg">Everything you need to know about KicksMtaani.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 last:border-none">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl font-bold">{faq.q}</span>
                {openIndex === i ? <Minus className="w-6 h-6 text-red-600" /> : <Plus className="w-6 h-6 text-gray-300" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 text-gray-500 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-black rounded-[2rem] p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <h3 className="text-2xl font-black mb-4 relative z-10">Still have questions?</h3>
          <p className="text-gray-400 mb-8 relative z-10">Our team is available 24/7 on WhatsApp to help you out.</p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all relative z-10"
          >
            <MessageCircle className="w-5 h-5" /> Chat with us
          </Link>
        </div>
      </div>
    </div>
  );
}
