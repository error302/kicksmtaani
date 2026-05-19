"use client";

import { Ruler } from "lucide-react";

export default function SizeGuidePage() {
  const menSizes = [
    { eu: "38", uk: "5", us: "6", cm: "24" },
    { eu: "39", uk: "6", us: "7", cm: "24.5" },
    { eu: "40", uk: "6.5", us: "7.5", cm: "25" },
    { eu: "41", uk: "7", us: "8", cm: "26" },
    { eu: "42", uk: "8", us: "9", cm: "27" },
    { eu: "43", uk: "9", us: "10", cm: "28" },
    { eu: "44", uk: "9.5", us: "10.5", cm: "28.5" },
    { eu: "45", uk: "10", us: "11", cm: "29" },
    { eu: "46", uk: "11", us: "12", cm: "30" },
  ];

  const womenSizes = [
    { eu: "35", uk: "2.5", us: "5", cm: "22" },
    { eu: "36", uk: "3.5", us: "6", cm: "23" },
    { eu: "37", uk: "4", us: "6.5", cm: "23.5" },
    { eu: "38", uk: "5", us: "7.5", cm: "24" },
    { eu: "39", uk: "6", us: "8.5", cm: "25" },
    { eu: "40", uk: "6.5", us: "9", cm: "25.5" },
    { eu: "41", uk: "7", us: "9.5", cm: "26" },
  ];

  const kidsSizes = [
    { eu: "28", uk: "10C", us: "11C", cm: "17" },
    { eu: "30", uk: "12C", us: "13C", cm: "18.5" },
    { eu: "32", uk: "13C", us: "1Y", cm: "20" },
    { eu: "34", uk: "2", us: "2.5Y", cm: "21" },
    { eu: "36", uk: "3.5", us: "4Y", cm: "22.5" },
  ];

  const SizeTable = ({ title, sizes }: { title: string; sizes: typeof menSizes }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-black text-white p-6">
        <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">EU</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">UK</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">US</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">CM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sizes.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold">{row.eu}</td>
                <td className="px-6 py-4">{row.uk}</td>
                <td className="px-6 py-4">{row.us}</td>
                <td className="px-6 py-4 text-red-600 font-bold">{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ruler className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tight mb-4">Size <span className="text-red-600">Guide.</span></h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find the perfect fit. Use the tables below to convert between EU, UK, US, and CM sizes across all our collections.
          </p>
        </div>

        <div className="space-y-8">
          <SizeTable title="Men's Sizes" sizes={menSizes} />
          <SizeTable title="Women's Sizes" sizes={womenSizes} />
          <SizeTable title="Kids' Sizes" sizes={kidsSizes} />
        </div>

        <div className="mt-12 bg-black rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <h3 className="text-2xl font-black mb-4 relative z-10">Not sure about your size?</h3>
          <p className="text-gray-400 mb-4 relative z-10">Measure your foot from heel to toe in CM and match it to the chart above.</p>
          <p className="text-gray-500 text-sm relative z-10">Remember: We offer a <strong className="text-white">7-day return policy</strong> if the fit isn&apos;t right.</p>
        </div>
      </div>
    </div>
  );
}
