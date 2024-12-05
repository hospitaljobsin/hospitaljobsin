"use client";

import { handleSignUpStep } from "@/lib/cognitoActions";
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
import { signUp } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const signUpSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    let nextStep;
    try {
      const {
        isSignUpComplete,
        userId,
        nextStep: step,
      } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,
            name: values.name,
            hasOnboarded: "false",
          },
          // optional
          autoSignIn: true,
        },
      });
      nextStep = step;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return;
    }

    await handleSignUpStep(nextStep, router);
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl text-center w-full">Create an account</h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
            <div className="w-full flex flex-col gap-6">
              <Input
                label="Name"
                labelPlacement="outside"
                placeholder="Enter your name"
                type="text"
                id="name"
                {...register("name")}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
              <Input
                label="Email"
                labelPlacement="outside"
                placeholder="Enter your email address"
                type="email"
                id="email"
                {...register("email")}
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
              />

              <Input
                label="Password"
                labelPlacement="outside"
                placeholder="Enter password"
                type="password"
                id="password"
                {...register("password")}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
              />
              <Button fullWidth type="submit" isLoading={isSubmitting}>
                Create account
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
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex justify-center w-full">
          <Link href="/auth/login" className="cursor-pointer text-blue-500">
            Already have an account? Log in.
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
