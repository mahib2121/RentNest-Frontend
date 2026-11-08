"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createRentalRequest } from "../_actions/rentalRequest";

type BookingFormProps = {
  propertyId: string;
};

export default function BookingForm({ propertyId }: BookingFormProps) {
  const [moveInDate, setMoveInDate] = useState("");
  const [durationMonths, setDurationMonths] = useState("12");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!moveInDate) {
      toast.error("Pick a move-in date.");
      return;
    }

    const duration = Number(durationMonths);

    if (!duration || duration < 1) {
      toast.error("Pick a valid rental duration.");
      return;
    }

    try {
      setLoading(true);

      const result = await createRentalRequest(
        propertyId,
        new Date(`${moveInDate}T00:00:00.000Z`).toISOString(),
        duration,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setMoveInDate("");
      setDurationMonths("12");
    } catch (error) {
      console.error(error);
      toast.error("Could not send the request. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <h2 className="border-t border-line pt-4 font-display text-lg tracking-tight">
        Request this property
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor="moveInDate">Move-in date</Label>

        <Input
          id="moveInDate"
          type="date"
          value={moveInDate}
          onChange={(event) => setMoveInDate(event.target.value)}
          required
          className="font-numeric"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="durationMonths">Rental duration</Label>

        <select
          id="durationMonths"
          value={durationMonths}
          onChange={(event) => setDurationMonths(event.target.value)}
          className="h-9 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="1">1 month</option>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending" : "Send rental request"}
      </Button>
    </form>
  );
}
