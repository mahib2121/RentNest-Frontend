"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerAction, RegisterState } from "../_actions/authAction";

const initialState: RegisterState = {
  success: false,
  message: "",
};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
        />

        {state.errors?.name && (
          <p className="text-xs text-status-rejected">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />

        {state.errors?.email && (
          <p className="text-xs text-status-rejected">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Choose a password"
        />

        {state.errors?.password && (
          <p className="text-xs text-status-rejected">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>

        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          className="font-numeric"
        />

        {state.errors?.phone && (
          <p className="text-xs text-status-rejected">
            {state.errors.phone[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">I am a</Label>

        <select
          id="role"
          name="role"
          defaultValue=""
          className="h-9 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="" disabled>
            Choose a role
          </option>

          <option value="TENANT">Tenant</option>
          <option value="LANDLORD">Landlord</option>
        </select>

        {state.errors?.role && (
          <p className="text-xs text-status-rejected">
            {state.errors.role[0]}
          </p>
        )}
      </div>

      <Button disabled={isPending} type="submit" className="w-full">
        {isPending ? "Creating account" : "Create account"}
      </Button>

      {state.message && (
        <p className="text-sm text-status-rejected">{state.message}</p>
      )}
    </form>
  );
};

export default RegisterForm;
