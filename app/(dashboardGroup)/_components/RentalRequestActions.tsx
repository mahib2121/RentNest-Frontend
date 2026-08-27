"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateRentalRequestStatus } from "../_actions/rentalRequests";

type Props = {
  requestId: string;
};

export default function RentalRequestActions({ requestId }: Props) {
  const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);
  const router = useRouter();
  async function handleAction(status: "APPROVED" | "REJECTED") {
    try {
      setLoading(status);

      const result = await updateRentalRequestStatus(requestId, status);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleAction("APPROVED")}
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading === "APPROVED" ? "Approving..." : "Approve"}
      </button>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleAction("REJECTED")}
        className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading === "REJECTED" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}
