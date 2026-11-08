"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction, type LoginResponse } from "../_actions/authAction";

const initialState: LoginResponse = {
  success: false,
  message: "",
};

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (!state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
