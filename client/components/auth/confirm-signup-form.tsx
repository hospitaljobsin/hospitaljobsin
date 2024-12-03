"use client";

import { handleSignUpStep } from "@/lib/cognitoActions";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SendVerificationCode from "./send-verification-code-form";

const confirmSignUpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6),
});

export default function ConfirmSignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmSignUpSchema>>({
    resolver: zodResolver(confirmSignUpSchema),
  });

  async function onSubmit(values: z.infer<typeof confirmSignUpSchema>) {
    let nextStep;
    try {
      const { isSignUpComplete, nextStep: step } = await confirmSignUp({
        username: values.email,
        confirmationCode: values.code,
      });
      nextStep = step;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return;
    }

    await handleSignUpStep(nextStep, router);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-4 pt-8">
        <div className="w-full flex flex-col gap-6">
          <h1 className={`text-center text-2xl`}>
            Please confirm your account.
          </h1>
          <Input
            id="email"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
          <Input
            id="code"
            label="Code"
            placeholder="Enter code"
            type="text"
            {...register("code")}
            errorMessage={errors.code?.message}
            isInvalid={!!errors.code}
          />
          <ConfirmButton />
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
        <SendVerificationCode />
      </div>
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending} type="submit">
      Confirm
    </Button>
  );
}
