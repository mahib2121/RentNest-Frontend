import Link from "next/link";

import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-[24rem]">
        <div className="border border-line bg-card p-6">
          <h1 className="font-display text-xl tracking-tight">
            Sign in
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Access your requests, listings, and payments.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          No account yet?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
