import Link from "next/link";

import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">RentNest</h1>

          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your RentNest account
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          Dont have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
