"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateRentalRequestStatus } from "../_actions/rentalRequests";

import { Button } from "@/components/ui/button";

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
    <div className="flex gap-2">
      <Button
        type="button"
        disabled={loading !== null}
        onClick={() => handleAction("APPROVED")}
      >
        {loading === "APPROVED" ? "Approving" : "Approve"}
      </Button>

      <Button
        type="button"
        variant="destructive"
        disabled={loading !== null}
        onClick={() => handleAction("REJECTED")}
      >
        {loading === "REJECTED" ? "Rejecting" : "Reject"}
      </Button>
    </div>
  );
}
