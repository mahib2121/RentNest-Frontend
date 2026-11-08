"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  cities: string[];
  categories: string[];
  values: {
    city: string;
    category: string;
    beds: string;
    maxRent: string;
  };
};

/**
 * The filter rail.
 *
 * The four filters are read when the form is submitted, not when they
 * change. Keeping them in component state meant every keystroke in the rent
 * field re-rendered the whole form — including every `<option>` in the city
 * and category lists. They now live in a ref: the input still shows what was
 * typed, but a keystroke no longer re-renders the option lists.
 *
 * The rent field is also the one control here that can reasonably be typed
 * into rather than picked, so it applies itself after a pause instead of
 * waiting for the Apply button.
 */
export default function PropertyFilters({
  cities,
  categories,
  values,
}: Props) {
  const router = useRouter();

  /**
   * The current filter values. A ref, not state: these are read at submit
   * time and never rendered, so a state update here would only cost renders.
   */
  const filters = useRef({
    city: values.city,
    category: values.category,
    beds: values.beds,
    maxRent: values.maxRent,
  });

  /**
   * The rent field is uncontrolled in spirit — the DOM holds what was typed
   * and the ref mirrors it. Only the rent value is state, because the input
   * needs to be able to reset it.
   */
  const [maxRent, setMaxRent] = useState(values.maxRent);

  const apply = useCallback(
    (overrides?: Partial<typeof filters.current>) => {
      const merged = { ...filters.current, ...overrides };

      const params = new URLSearchParams();

      if (merged.city) params.set("city", merged.city);
      if (merged.category) params.set("category", merged.category);
      if (merged.beds) params.set("beds", merged.beds);
      if (merged.maxRent) params.set("maxRent", merged.maxRent);

      const query = params.toString();

      router.push(query ? `/properties?${query}` : "/properties");
    },
    [router],
  );

  /**
   * Auto-apply the rent filter once the user stops typing. The timer is
   * cleared on every change, so only the final value is ever applied.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (maxRent === values.maxRent) {
        return;
      }

      apply({ maxRent });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [maxRent, values.maxRent, apply]);

  function reset() {
    filters.current = { city: "", category: "", beds: "", maxRent: "" };

    setMaxRent("");

    router.push("/properties");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
      className="space-y-4 border border-line bg-paper-raised p-4"
    >
      <h2 className="border-b border-line pb-2 font-label text-sm">
        Filters
      </h2>

      <div className="space-y-1.5">
        <Label htmlFor="filter-city">City</Label>

        <select
          id="filter-city"
          defaultValue={values.city}
          onChange={(event) => {
            filters.current.city = event.target.value;
          }}
          className="h-9 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">All cities</option>

          {cities.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Category</Label>

        <select
          id="filter-category"
          defaultValue={values.category}
          onChange={(event) => {
            filters.current.category = event.target.value;
          }}
          className="h-9 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">All categories</option>

          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-beds">Minimum bedrooms</Label>

        <select
          id="filter-beds"
          defaultValue={values.beds}
          onChange={(event) => {
            filters.current.beds = event.target.value;
          }}
          className="h-9 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-max-rent">Maximum rent</Label>

        <Input
          id="filter-max-rent"
          type="number"
          min={0}
          step={500}
          value={maxRent}
          onChange={(event) => {
            const next = event.target.value;

            setMaxRent(next);
            filters.current.maxRent = next;
          }}
          placeholder="40000"
          className="font-numeric"
        />

        <p className="text-xs text-muted-foreground">
          Applies as you type.
        </p>
      </div>

      <div className="flex gap-2 border-t border-line pt-4">
        <Button type="submit" size="sm">
          Apply
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={reset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
