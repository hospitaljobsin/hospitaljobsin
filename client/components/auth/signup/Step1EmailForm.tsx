// Step1EmailForm.tsx
"use client";

import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";
import type { Step1EmailFormMutation as Step1EmailFormMutationType } from "./__generated__/Step1EmailFormMutation.graphql";

const step1Schema = z.object({
  email: z.string().email(),
});


const RequestVerificationMutation = graphql`
  mutation Step1EmailFormMutation($email: String!, $recaptchaToken: String!) {
    requestEmailVerificationToken(email: $email, recaptchaToken: $recaptchaToken) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidEmailError {
        message
      }
      ... on EmailVerificationTokenCooldownError {
        message
        remainingSeconds
      }
      ... on InvalidRecaptchaTokenError {
        message
      }
      ... on RequestEmailVerificationSuccess {
        message
        remainingSeconds
      }
    }
  }
`;

export default function Step1EmailForm({ onSuccess, }: { onSuccess: (email: string, cooldown: number) => void }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: "" }
  });

  const [commitRequestVerification] = useMutation<Step1EmailFormMutationType>(RequestVerificationMutation);

  const onSubmit = async (data: { email: string }) => {
    if (!executeRecaptcha) return;
    
    const token = await executeRecaptcha("email_verification");
    commitRequestVerification({
      variables: { email: data.email, recaptchaToken: token },
      onCompleted(response) {
        if (
            response.requestEmailVerificationToken.__typename ===
                "EmailInUseError" ||
            response.requestEmailVerificationToken.__typename ===
                "InvalidEmailError"
        ) {
            setError("email", {
                message: response.requestEmailVerificationToken.message,
            });
        } else if (
            response.requestEmailVerificationToken.__typename ===
            "InvalidRecaptchaTokenError"
        ) {
            // handle recaptcha failure
            alert("Recaptcha failed. Please try again.");
        } else if (
            response.requestEmailVerificationToken.__typename ===
            "EmailVerificationTokenCooldownError"
        ) {
            onSuccess(data.email, response.requestEmailVerificationToken.remainingSeconds);
        } else if (
            response.requestEmailVerificationToken.__typename ===
            "RequestEmailVerificationSuccess"
        ) {
            onSuccess(data.email, response.requestEmailVerificationToken.remainingSeconds);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="w-full flex flex-col gap-6">
        <Input
          label="Email Address"
          placeholder="Enter your email address"
          type="email"
          {...register("email")}
          errorMessage={formState.errors.email?.message}
          isInvalid={!!formState.errors.email}
        />
        <Button fullWidth type="submit" isLoading={formState.isSubmitting}>
          Continue
        </Button>
      </div>
    </form>
  );
}