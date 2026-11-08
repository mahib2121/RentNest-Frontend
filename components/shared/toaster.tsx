"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The toast host.
 *
 * `sonner` is loaded on demand rather than bundled up front. A static import
 * would put ~35 KB of toast runtime on the critical path for every visitor,
 * including the marketing pages where no toast is ever fired.
 *
 * The dynamic import is gated behind `mounted` so it only resolves in the
 * browser, after the first paint has already happened.
 */
const Sonner = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false },
);

export function Toaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer past hydration so the initial paint is never blocked by it.
    const id = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Sonner position="top-right" richColors />;
}
