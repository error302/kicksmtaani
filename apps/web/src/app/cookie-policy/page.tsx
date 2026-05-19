"use client";

export default function CookiePolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Cookie <span className="text-red-600">Policy.</span></h1>
          <div className="prose prose-red max-w-none space-y-8 text-gray-600">
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">What Are Cookies</h2>
              <p>Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login sessions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">How We Use Cookies</h2>
              <p>We use cookies for essential site functionality (login sessions, cart persistence), analytics (understanding how visitors use KicksMtaani), and personalisation (remembering your size preferences and recently viewed items).</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Disabling cookies may affect certain features of the site, such as the shopping cart and login functionality.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-4">Third-Party Cookies</h2>
              <p>We may use third-party services like payment gateways (M-Pesa, Flutterwave) that set their own cookies. These are governed by the respective providers&apos; cookie policies.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
