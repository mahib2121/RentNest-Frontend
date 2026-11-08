import Link from "next/link";

import RegisterForm from "../_components/RegisterForm";

const RegisterPage = () => {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-[24rem]">
        <div className="border border-line bg-card p-6">
          <h1 className="font-display text-xl tracking-tight">
            Create an account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Rent a home, or publish the ones you own.
          </p>

          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
