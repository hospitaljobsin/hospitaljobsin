"use client";

import { handleSignUp } from "@/lib/cognitoActions";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function SignUpForm() {
  const [errorMessage, dispatch] = useActionState(handleSignUp, undefined);
  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-4 pt-8">
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-2xl text-center">Please create an account.</h1>
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            placeholder="Enter your name"
            type="text"
            id="name"
            minLength={4}
          />
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your email address"
            type="email"
            id="email"
          />

          <Input
            isRequired
            label="Password"
            labelPlacement="outside"
            placeholder="Enter password"
            type="password"
            id="password"
            minLength={6}
          />
          <SignUpButton />
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="mt-2 cursor-pointer text-blue-500"
          >
            Already have an account? Log in.
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

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending} type="submit">
      Create account
    </Button>
  );
}
