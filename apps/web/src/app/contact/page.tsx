"use client";

import { Mail, Phone, MapPin, Send, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Info */}
            <div className="space-y-12">
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tight mb-6">Get in <span className="text-red-600">Touch.</span></h1>
                <p className="text-gray-500 text-xl max-w-md">
                  Have a question about a release or need help with an order? Our team is here to help you stay fresh.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                    <p className="font-bold text-lg">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                    <p className="font-bold text-lg">info@kicksmtaani.co.ke</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Visit Us</p>
                    <p className="font-bold text-lg">Nairobi, CBD Store</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-gray-200">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Social Channels</p>
                <div className="flex gap-4">
                  <button className="bg-white p-4 rounded-2xl shadow-sm hover:text-red-600 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </button>
                  <button className="bg-white p-4 rounded-2xl shadow-sm hover:text-red-600 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </button>
                  <button className="bg-white p-4 rounded-2xl shadow-sm hover:text-green-600 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Order Inquiry" 
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="How can we help?" 
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  />
                </div>

                <button className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
