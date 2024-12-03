"use client";

import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { resetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

const submitResetPasswordSchema = z.object({
  email: z.string().email(),
});

export default function SubmitResetPasswordFrom() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof submitResetPasswordSchema>>({
    resolver: zodResolver(submitResetPasswordSchema),
  });

  async function onSubmit(values: z.infer<typeof submitResetPasswordSchema>) {
    try {
      await resetPassword({ username: values.email });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return;
    }

    router.replace("/auth/reset-password/confirm");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
            {...register("email")}
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
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
    <Button fullWidth disabled={pending} type="submit">
      Send Code
    </Button>
  );
}
