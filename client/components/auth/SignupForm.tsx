"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";

const SignupFormMutation = graphql`
  mutation SignupFormMutation($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      __typename
      ... on EmailInUseError {
        message
      }
    }
  }
`;

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignUpForm() {
  const router = useRouter();
  const [commitMutation, isMutationInFlight] = useMutation(SignupFormMutation);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    commitMutation({
      variables: {
        email: values.email,
        password: values.password,
      },
      onCompleted(response) {
        if (response.register?.__typename === "EmailInUseError") {
          setError("email", { message: response.register.message });
        } else {
          router.replace("/auth/confirm-signup");
        }
      },
    });
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
              <Button
                fullWidth
                type="submit"
                isLoading={isSubmitting || isMutationInFlight}
              >
                Create account
              </Button>
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
