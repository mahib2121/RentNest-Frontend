"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <Card className="space-y-4 p-5">
        <div>
          <Input name="name" type="text" placeholder="Enter your name" />

          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <Input name="email" type="email" placeholder="Enter your email" />

          {state.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
          />

          {state.errors?.password && (
            <p className="text-sm text-red-500">{state.errors.password[0]}</p>
          )}
        </div>

        <div>
          <Input
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
          />

          {state.errors?.phone && (
            <p className="text-sm text-red-500">{state.errors.phone[0]}</p>
          )}
        </div>

        <div>
          <select
            name="role"
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="TENANT">Tenant</option>
            <option value="LANDLORD">Landlord</option>
          </select>

          {state.errors?.role && (
            <p className="text-sm text-red-500">{state.errors.role[0]}</p>
          )}
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Registering..." : "Register"}
        </Button>

        {state.message && <p className="text-sm">{state.message}</p>}
      </Card>
    </form>
  );
};

export default RegisterForm;
