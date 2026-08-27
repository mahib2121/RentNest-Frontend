"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // <-- Import your UI component
import { createCheckout } from "@/app/(publicGroup)/_actions/payment";

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

      if (!result.paymentUrl) {
        toast.error("Payment URL was not returned.");
        return;
      }

      // Using window.location.href is CORRECT here if redirecting to
      // an external gateway (like Stripe, SSLCommerz, etc.)
      window.location.href = result.paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Unable to start payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="w-fit"
    >
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
}
