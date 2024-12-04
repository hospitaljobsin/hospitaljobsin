"use client";

import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { resendSignUpCode, signIn } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      let redirectLink = "/";
      try {
        const { isSignedIn, nextStep } = await signIn({
          username: values.email,
          password: values.password,
        });
        if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
          await resendSignUpCode({
            username: values.email,
          });
          redirectLink = "/auth/confirm-signup";
        }
      } catch (error) {
        return getErrorMessage(error);
      }
      router.replace(redirectLink);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <Card>
      <CardHeader>
        <h1 className={`text-2xl text-center w-full`}>Log in to continue</h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
            <div className="w-full flex flex-col gap-6">
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
                label="Password"
                placeholder="Enter password"
                type="password"
                {...register("password")}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
                description={
                  <div className="w-full flex justify-start">
                    <Link
                      href="/auth/reset-password/submit"
                      className="mt-2 cursor-pointer text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                }
              />

              <Button fullWidth isLoading={isSubmitting} type="submit">
                Log in
              </Button>
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
      </CardBody>{" "}
      <Divider />
      <CardFooter>
        <div className="flex justify-center w-full">
          <Link
            href="/auth/signup"
            className="mt-2 cursor-pointer text-blue-500"
          >
            {"Don't have an account? "} Sign up.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
