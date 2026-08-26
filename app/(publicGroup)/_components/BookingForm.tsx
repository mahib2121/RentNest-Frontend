"use client";

import { useState } from "react";
import { toast } from "sonner";

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
      toast.error("Please select a move-in date.");
      return;
    }

    const duration = Number(durationMonths);

    if (!duration || duration < 1) {
      toast.error("Please select a valid duration.");
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
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="mb-4 text-2xl font-semibold">Book This Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="moveInDate"
            className="mb-1 block text-sm font-medium"
          >
            Move-in Date
          </label>

          <input
            id="moveInDate"
            type="date"
            value={moveInDate}
            onChange={(event) => setMoveInDate(event.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="durationMonths"
            className="mb-1 block text-sm font-medium"
          >
            Rental Duration
          </label>

          <select
            id="durationMonths"
            value={durationMonths}
            onChange={(event) => setDurationMonths(event.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Rental Request"}
        </button>
      </form>
    </div>
  );
}
