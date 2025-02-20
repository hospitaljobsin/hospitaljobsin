"use client";

import links from "@/lib/links";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
	Link,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";
import type { SubmitResetPasswordFormMutation as SubmitResetPasswordFormMutationType } from "./__generated__/SubmitResetPasswordFormMutation.graphql";

const SubmitResetPasswordFormMutation = graphql`
  mutation SubmitResetPasswordFormMutation($email: String!, $recaptchaToken: String!) {
	requestPasswordReset(email: $email, recaptchaToken: $recaptchaToken) {
	  __typename
	}
  }
`;

const submitResetPasswordSchema = z.object({
	email: z.string().email(),
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
		resolver: zodResolver(submitResetPasswordSchema),
	});

	const { executeRecaptcha } = useGoogleReCaptcha();

	async function onSubmit(values: z.infer<typeof submitResetPasswordSchema>) {
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeRecaptcha("password_reset_request");
		commitMutation({
			variables: {
				email: values.email,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.requestPasswordReset.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else {
					setShowSuccessMessage(true);
				}
			},
		});
	}

	return (
		<>
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<h1 className="text-center text-2xl w-full">Reset Your Password</h1>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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

			{showSuccessMessage && (
				<div className="mt-12">
					<Alert
						isVisible={showSuccessMessage}
						onClose={() => setShowSuccessMessage(false)}
						hideIcon
						color="success"
						description={
							"If an account with that email exists, we will send you a password reset link. Please check your email inbox."
						}
						variant="flat"
					/>
				</div>
			)}
		</>
	);
}
