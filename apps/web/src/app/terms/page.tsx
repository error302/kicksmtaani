"use client";

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Terms of <span className="text-red-600">Service.</span></h1>
          <div className="prose prose-red max-w-none space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">1. Introduction</h2>
              <p>Welcome to KicksMtaani. By using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">2. Authenticity</h2>
              <p>We guarantee the authenticity of all sneakers sold on our platform. Every item undergoes a multi-step verification process before shipping.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">3. Payments</h2>
              <p>Payments are processed via M-Pesa or secure card gateways. Orders are only processed once payment is confirmed.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">4. Shipping</h2>
              <p>Shipping times are estimates. While we strive for same-day delivery in Nairobi, external factors like traffic or weather may cause delays.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
