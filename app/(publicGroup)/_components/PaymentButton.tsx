"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createCheckout } from "../../(publicGroup)/_actions/payment";

type PaymentButtonProps = {
  rentalRequestId: string;
};

export default function PaymentButton({ rentalRequestId }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const result = await createCheckout(rentalRequestId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (!result. paymentUrl) {
        toast.error("Payment checkout URL was not returned.");
        return;
      }

      window.location.href = result.paymentUrl;
    } catch (error) {
      console.error(error);
      toast.error("Unable to start payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="rounded bg-black px-5 py-2 text-white disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
