"use client";

import type { SubmitResetPasswordFormMutation as SubmitResetPasswordFormMutationType } from "@/__generated__/SubmitResetPasswordFormMutation.graphql";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import { useTurnstile } from "../TurnstileProvider";

const SubmitResetPasswordFormMutation = graphql`
  mutation SubmitResetPasswordFormMutation($email: String!, $captchaToken: String!) {
	requestPasswordReset(email: $email, captchaToken: $captchaToken) {
	  __typename
	  ... on InvalidCaptchaTokenError {
		message
	  }
	  ... on PasswordResetTokenCooldownError {
		message
		remainingSeconds
	  }
	}
  }
`;

const submitResetPasswordSchema = z.object({
	email: z.string().check(z.minLength(1, "This field is required"), z.email()),
});

export default function SubmitResetPasswordFrom() {
	const [commitMutation, isMutationInFlight] =
		useMutation<SubmitResetPasswordFormMutationType>(
			SubmitResetPasswordFormMutation,
		);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof submitResetPasswordSchema>>({
		resolver: standardSchemaResolver(submitResetPasswordSchema),
	});

	const { executeCaptcha } = useTurnstile();

	async function onSubmit(values: z.infer<typeof submitResetPasswordSchema>) {
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeCaptcha("password_reset_request");
		commitMutation({
			variables: {
				email: values.email,
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.requestPasswordReset.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.requestPasswordReset.__typename ===
					"PasswordResetTokenCooldownError"
				) {
					setShowSuccessMessage(true);
				} else {
					setShowSuccessMessage(true);
				}
			},
		});
	}

	if (showSuccessMessage) {
		return (
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<h1 className="text-center text-lg w-full">
						Password Reset Requested
					</h1>
				</CardHeader>
				<CardBody>
					<div className="text-center w-full text-foreground-500">
						If an account with that email exists, we will send you a password
						reset link. Please check your email inbox.
					</div>
				</CardBody>
				<CardFooter>
					<Button fullWidth variant="ghost" as={Link} href={links.login()}>
						Back to login
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="p-6 space-y-6" shadow="none">
			<CardHeader>
				<h1 className="text-center text-2xl w-full">Reset Your Password</h1>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="w-full flex flex-col gap-6">
						<Input
							id="email"
							label="Email Address"
							placeholder="Enter your email address"
							type="text"
							{...register("email")}
							errorMessage={errors.email?.message}
							isInvalid={!!errors.email}
						/>
						<Button
							fullWidth
							isLoading={isSubmitting || isMutationInFlight}
							type="submit"
						>
							Request Password Reset
						</Button>
					</div>
				</form>
			</CardBody>
			<Divider />
			<CardFooter className="w-full flex items-center justify-center">
				<Link
					href={links.login()}
					className="cursor-pointer text-blue-500 text-small sm:text-sm text-center"
				>
					Back to login
				</Link>
			</CardFooter>
		</Card>
	);
}
