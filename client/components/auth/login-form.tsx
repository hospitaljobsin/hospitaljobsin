"use client";

import { handleSignIn } from "@/lib/cognitoActions";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(handleSignIn, undefined);
  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-4 pt-8">
        <div className="w-full flex flex-col gap-6">
          <h1 className={`text-2xl text-center`}>Please log in to continue.</h1>
          <Input
            id="email"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            isRequired
          />
          <Input
            id="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            isRequired
          />

          <LoginButton />
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/reset-password/submit"
            className="mt-2 cursor-pointer text-blue-500"
          >
            Forgot password? Click here.
          </Link>
        </div>
        <div className="flex justify-center">
          <Link
            href="/auth/signup"
            className="mt-2 cursor-pointer text-blue-500"
          >
            {"Don't have an account? "} Sign up.
          </Link>
        </div>
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending}>
      Log in
    </Button>
  );
}
