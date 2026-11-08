import Link from "next/link";

import { cn } from "@/lib/utils";

type View = "cards" | "table";

/**
 * Switches the results between a card grid and a comparison table.
 *
 * The choice lives in the query string so it survives a refresh, a shared
 * link, and the browser's back button.
 */
export default function ViewToggle({
  view,
  query,
}: {
  view: View;
  query: string;
}) {
  function href(next: View) {
    const params = new URLSearchParams(query);

    params.set("view", next);

    return `/properties?${params.toString()}`;
  }

  const options: { key: View; label: string }[] = [
    { key: "cards", label: "Cards" },
    { key: "table", label: "Table" },
  ];

  return (
    <div
      role="group"
      aria-label="Result layout"
      className="flex items-center gap-0.5 border border-line bg-paper-raised p-0.5"
    >
      {options.map((option) => {
        const active = view === option.key;

        return (
          <Link
            key={option.key}
            href={href(option.key)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "px-2.5 py-1 font-label text-xs transition-colors duration-150 ease-out",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
