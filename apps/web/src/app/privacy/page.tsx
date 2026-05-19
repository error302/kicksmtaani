"use client";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Privacy <span className="text-red-600">Policy.</span></h1>
          <div className="prose prose-red max-w-none space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">Data Collection</h2>
              <p>We collect personal information such as name, email, phone number, and delivery address to process your orders and improve your experience.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">Data Usage</h2>
              <p>Your data is used solely for order fulfillment, customer support, and (if opted-in) marketing communications. We never sell your data to third parties.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">Security</h2>
              <p>We use industry-standard encryption to protect your sensitive data during transmission and storage.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
