"use client";

import { handleSendEmailVerificationCode } from "@/lib/cognitoActions";
import { Button } from "@nextui-org/react";
import { ArrowRightIcon } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function SendVerificationCode() {
  const [response, dispatch] = useActionState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        className="mt-4 w-full"
        disabled={pending}
        formAction={dispatch}
        type="submit"
      >
        Resend Verification Code{" "}
        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-800" />
      </Button>
      <div className="flex h-8 items-end space-x-1">
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {response?.errorMessage && (
            <>
              <p className="text-sm text-red-500">{response.errorMessage}</p>
            </>
          )}
          {response?.message && (
            <p className="text-sm text-green-500">{response.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
