import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-[26rem]">
        <div className="border border-line bg-card p-6">
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-status-approved/40 text-status-approved">
              <Check className="h-4 w-4" />
            </span>

            <h1 className="font-display text-xl tracking-tight">
              Payment received
            </h1>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your payment was submitted. The booking is confirmed once the
            landlord verifies it — you can follow it from your dashboard.
          </p>

          <div className="mt-6 border-t border-line pt-4">
            <Button asChild className="w-full">
              <Link href="/tenant-dashboard">
                Go to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
