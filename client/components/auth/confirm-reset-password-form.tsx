"use client";

import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmResetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code: z.string().min(6),
});

export default function ConfirmResetPasswordForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof confirmResetPasswordSchema>>({
    resolver: zodResolver(confirmResetPasswordSchema),
  });

  async function onSubmit(values: z.infer<typeof confirmResetPasswordSchema>) {
    try {
      await confirmResetPassword({
        username: values.email,
        confirmationCode: values.code,
        newPassword: values.password,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return;
    }

    router.replace("/auth/login");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-800 px-6 pb-4 pt-8">
        <div className="w-full flex flex-col gap-6">
          <h1 className={`text-center text-2xl`}>Reset password.</h1>
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
            id="password"
            label="New Password"
            placeholder="Enter password"
            type="password"
            {...register("password")}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
          <Input
            id="code"
            label="Confirmation Code"
            placeholder="Enter code"
            type="text"
            {...register("code")}
            errorMessage={errors.code?.message}
            isInvalid={!!errors.code}
          />
          <ResetPasswordButton />
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

function ResetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth disabled={pending} type="submit">
      Reset Password
    </Button>
  );
}
