import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-numeric text-sm text-muted-foreground">404</p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you are looking for has moved or never existed. Search the
        listings instead.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/properties">Browse properties</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
