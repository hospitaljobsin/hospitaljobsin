"use client";

import { handleResetPassword } from "@/lib/cognitoActions";
import { Button, Input } from "@nextui-org/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitResetPasswordFrom() {
  const [errorMessage, dispatch] = useActionState(
    handleResetPassword,
    undefined
  );
  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-4 pt-8">
        <div className="w-full flex flex-col gap-6">
          <h1 className={`text-center text-2xl`}>
            Please enter your email to get confirmation code.
          </h1>
          <Input
            id="email"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            isRequired
          />
          <SendConfirmationCodeButton />
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

function SendConfirmationCodeButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending}>
      Send Code
    </Button>
  );
}
