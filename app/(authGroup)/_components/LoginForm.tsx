"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_actions/authAction";
const initialState = {
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
      <Card className="space-y-4 p-5">
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />

        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Login"}
        </Button>
      </Card>
    </form>
  );
};

export default LoginForm;
