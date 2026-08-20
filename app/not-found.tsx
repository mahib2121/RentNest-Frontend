import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>

      <p className="mt-6 text-sm font-semibold text-muted-foreground">404</p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or no longer exists.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
