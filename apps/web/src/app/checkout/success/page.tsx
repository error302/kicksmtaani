import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        You will receive an M-Pesa prompt shortly. Check your phone for payment
        instructions.
      </p>
      <Link
        href="/account/orders"
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark"
      >
        View Orders
      </Link>
    </div>
  );
}
