"use client";

import { getErrorMessage } from "@/utils/get-error-message";
import { Button } from "@nextui-org/react";
import { resendSignUpCode } from "aws-amplify/auth";
import { ArrowRightIcon } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { z } from "zod";

const sendVerificationCodeSchema = z.object({
  email: z.string().email(),
});

export default function SendVerificationCode() {
  const [response, dispatch] = useActionState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  async function handleSendEmailVerificationCode(
    values: z.infer<typeof sendVerificationCodeSchema>
  ) {
    let currentState;
    try {
      await resendSignUpCode({
        username: values.email,
      });
      currentState = {
        ...prevState,
        message: "Code sent successfully",
      };
    } catch (error) {
      currentState = {
        ...prevState,
        errorMessage: getErrorMessage(error),
      };
    }

    return currentState;
  }
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
