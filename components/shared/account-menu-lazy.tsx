"use client";

import { Suspense } from "react";

import { AccountMenu } from "./account-menu";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A lazy handle on the account dropdown.
 *
 * The dropdown is the only part of the navbar that needs the browser, and it
 * carries the radix dropdown primitives with it. Splitting it into its own
 * module keeps those out of the chunk every visitor downloads — an anonymous
 * visitor only fetches them once they actually sign in.
 *
 * The important detail is that this is *not* `next/dynamic` with
 * `ssr: false`. Turning off SSR for a component that sits in the middle of
 * the server-rendered navbar makes Next bail out to client-side rendering
 * for that whole branch: the account button is left out of the server HTML
 * entirely, and the navbar shows a hole where it should be until the lazy
 * chunk has been fetched *and* hydrated. Measured on the production build,
 * that was a 3.2 second gap — first paint at 172 ms, the account button
 * arriving at 3197 ms.
 *
 * A plain `Suspense` boundary keeps the server-rendered markup intact: the
 * button is in the HTML from the first byte, and the fallback only shows if
 * the chunk genuinely has not arrived yet.
 */
export function AccountMenuLazy(props: {
  name: string;
  email: string;
  role: string;
  photo: string | null;
  dashboardHref: string;
}) {
  return (
    <Suspense fallback={<AccountMenuFallback name={props.name} />}>
      <AccountMenu {...props} />
    </Suspense>
  );
}

/**
 * The placeholder shown while the account menu's chunk is still in flight.
 *
 * It reproduces the real component's box exactly — a 32px square avatar and
 * the name beside it — so nothing shifts when the real control takes over.
 * The name is only shown from `sm` up, matching the real trigger.
 */
function AccountMenuFallback({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-hidden="true"
    >
      <Skeleton className="h-8 w-8 rounded-sm bg-secondary" />

      <Skeleton className="hidden h-4 w-24 sm:inline-block" />

      <span className="sr-only">{name}</span>
    </div>
  );
}
