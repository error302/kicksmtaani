import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">KicksMtaani</h3>
            <p className="text-gray-400">
              Premium shoes for the whole family in Kenya.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/products?category=MEN">Men</Link>
              <Link href="/products?category=WOMEN">Women</Link>
              <Link href="/products?category=KIDS">Kids</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/contact">Contact Us</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/shipping">Shipping Info</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-gray-400">
              <p>Nairobi, Kenya</p>
              <p>info@kicksmtaani.co.ke</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © 2024 KicksMtaani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
