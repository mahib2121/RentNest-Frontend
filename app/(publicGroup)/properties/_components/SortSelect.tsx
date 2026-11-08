"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export type SortOption = {
  value: string;
  label: string;
};

const OPTIONS: SortOption[] = [
  { value: "rentPrice", label: "Rent, low to high" },
  { value: "rentPrice-desc", label: "Rent, high to low" },
  { value: "areaSqft-desc", label: "Largest area" },
  { value: "bedrooms-desc", label: "Most bedrooms" },
  { value: "title", label: "Name" },
];

/**
 * Sort control for the card view.
 *
 * A native select keeps the form language consistent with the filter rail,
 * and pushes the choice into the query string so it survives a refresh.
 */
export default function SortSelect({
  value,
  query,
}: {
  value: string;
  query: string;
}) {
  const router = useRouter();

  function change(next: string) {
    const params = new URLSearchParams(query);

    params.set("sort", next);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2">
      <span className="font-label text-xs text-muted-foreground">
        Sort
      </span>

      <select
        value={value}
        onChange={(event) => change(event.target.value)}
        aria-label="Sort listings"
        className={cn(
          "h-8 rounded-sm border border-input bg-transparent px-2 text-sm",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
