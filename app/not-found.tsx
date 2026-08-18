import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-muted-foreground">404</p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight">Page not found</h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you're looking for.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Go back home
      </Link>
    </main>
  );
};

export default NotFound;
