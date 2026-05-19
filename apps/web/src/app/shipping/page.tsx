"use client";

import { Truck, ShieldCheck, Clock, RefreshCcw, MapPin } from "lucide-react";

export default function ShippingPage() {
  const policies = [
    {
      title: "Same Day Delivery",
      desc: "Nairobi & Mombasa orders placed before 2 PM are delivered the same day.",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Countrywide Shipping",
      desc: "We ship to all parts of Kenya via G4S or Wells Fargo. Takes 2-3 business days.",
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Authenticity Guarantee",
      desc: "Every pair is double-boxed and shipped in a protective outer layer.",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "7-Day Returns",
      desc: "Don't like the fit? Return within 7 days for an exchange or store credit.",
      icon: RefreshCcw,
      color: "text-red-500",
      bg: "bg-red-50"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black uppercase tracking-tight mb-4">Shipping & <span className="text-red-600">Returns.</span></h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            Fast, secure, and reliable. We make sure your kicks arrive in perfect condition, every time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {policies.map((policy, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:shadow-2xl transition-all duration-500">
              <div className={`${policy.bg} ${policy.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <policy.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{policy.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{policy.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight">Delivery Pricing</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="font-bold text-lg">Nairobi & Environs</span>
                  <span className="text-red-600 font-black">KES 300</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="font-bold text-lg">Mombasa & Kisumu</span>
                  <span className="text-red-600 font-black">KES 500</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="font-bold text-lg">Upcountry (G4S/Wells Fargo)</span>
                  <span className="text-red-600 font-black">KES 600</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center">
              <MapPin className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Track Order</p>
              <p className="text-gray-500 text-sm mb-6">Enter your order number to track your package in real-time.</p>
              <input 
                type="text" 
                placeholder="KM-XXXXX" 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl mb-4 text-center font-bold"
              />
              <button className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
