"use client";

import type { Step1EmailFormMutation as Step1EmailFormMutationType } from "@/__generated__/Step1EmailFormMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod/v4-mini";
import SignupContext from "./SignupContext";

const step1Schema = z.object({
	email:  z.string().check(z.minLength(1, "This field is required"), z.email()),
});

const RequestVerificationMutation = graphql`
  mutation Step1EmailFormMutation($email: String!, $captchaToken: String!) {
    requestEmailVerificationToken(email: $email, captchaToken: $captchaToken) {
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
      ... on InvalidCaptchaTokenError {
        message
      }
      ... on RequestEmailVerificationSuccess {
        message
        remainingSeconds
      }
    }
  }
`;

export default function Step1EmailForm() {
	const { send } = SignupContext.useActorRef();
	const email = SignupContext.useSelector((state) => state.context.email);
	const emailError = SignupContext.useSelector(
		(state) => state.context.emailError,
	);
	const { executeCaptcha } = useTurnstile();
	const { register, handleSubmit, formState, setError } = useForm<z.infer<typeof step1Schema>>({
		resolver: standardSchemaResolver(step1Schema),
		defaultValues: { email: email || "" },
	});

	useEffect(() => {
		if (emailError) {
			setError("email", {
				message: emailError,
			});
		}
	}, [emailError, setError]);

	const [commitRequestVerification] = useMutation<Step1EmailFormMutationType>(
		RequestVerificationMutation,
	);

	const onSubmit = async (data: z.infer<typeof step1Schema>) => {
		if (!executeCaptcha) return;

		const token = await executeCaptcha("email_verification");
		commitRequestVerification({
			variables: { email: data.email, captchaToken: token },
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
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.requestEmailVerificationToken.__typename ===
					"EmailVerificationTokenCooldownError"
				) {
					send({
						type: "SUBMIT_EMAIL",
						email: data.email,
						cooldown: response.requestEmailVerificationToken.remainingSeconds,
					});
				} else if (
					response.requestEmailVerificationToken.__typename ===
					"RequestEmailVerificationSuccess"
				) {
					send({
						type: "SUBMIT_EMAIL",
						email: data.email,
						cooldown: response.requestEmailVerificationToken.remainingSeconds,
					});
				}
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<Input
					{...register("email")}
					label="Email Address"
					placeholder="Enter your email address"
					type="text"
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
