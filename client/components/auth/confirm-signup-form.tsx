"use client";

import { handleSignUpStep } from "@/lib/cognitoActions";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmSignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  code: z.string().min(6, { message: "Code must be at least 6 characters" }),
});

export default function ConfirmSignUpForm() {
  const router = useRouter();
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendErrorMessage, setResendErrorMessage] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof confirmSignUpSchema>>({
    resolver: zodResolver(confirmSignUpSchema),
    mode: "onChange",
  });

  const email = watch("email");
  const code = watch("code");

  async function handleSendEmailVerificationCode({ email }: { email: string }) {
    try {
      await resendSignUpCode({ username: email });
      setResendMessage("Verification code sent successfully");
      setResendErrorMessage(null);
    } catch (error) {
      setResendErrorMessage(getErrorMessage(error));
      setResendMessage(null);
    }
  }

  async function onSubmit(values: z.infer<typeof confirmSignUpSchema>) {
    let nextStep;
    try {
      const { isSignUpComplete, nextStep: step } = await confirmSignUp({
        username: values.email,
        confirmationCode: values.code,
      });
      nextStep = step;
      setErrorMessage(null);
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
          <Button
            fullWidth
            disabled={!email || !code || !isValid}
            type="submit"
          >
            Confirm
          </Button>
        </div>

        {errorMessage && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}

        <Button
          className="mt-4 w-full"
          disabled={!email || !!errors.email}
          onClick={() => handleSendEmailVerificationCode({ email })}
          type="button"
        >
          Resend Verification Code{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-800" />
        </Button>

        {resendErrorMessage && (
          <p className="mt-2 text-sm text-red-500">{resendErrorMessage}</p>
        )}
        {resendMessage && (
          <p className="mt-2 text-sm text-green-500">{resendMessage}</p>
        )}
      </div>
    </form>
  );
}
