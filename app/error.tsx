"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-label text-sm text-muted-foreground">Error</p>

      <h1 className="mt-3 max-w-md font-display text-3xl tracking-tight text-foreground">
        This page failed to load
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Something went wrong on our end. Try loading the page again, and if it
        keeps failing, sign out and back in.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>

        <Button variant="outline" asChild>
          <Link href="/">Go to the home page</Link>
        </Button>
      </div>
    </main>
  );
}
