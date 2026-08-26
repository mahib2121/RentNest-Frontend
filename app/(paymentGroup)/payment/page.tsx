import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto max-w-xl p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold">Payment Successful</h1>

      <p className="mb-6">Your payment has been submitted successfully.</p>

      <p className="mb-6 text-sm text-gray-600">
        Your booking will be confirmed after the payment is verified.
      </p>

      <Link
        href="/tenant-dashboard"
        className="rounded bg-black px-5 py-3 text-white"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
