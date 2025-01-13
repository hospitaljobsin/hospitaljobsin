"use client";

import links from "@/lib/links";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
	Link,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";
import type { SubmitResetPasswordFormMutation as SubmitResetPasswordFormMutationType } from "./__generated__/SubmitResetPasswordFormMutation.graphql";

const SubmitResetPasswordFormMutation = graphql`
  mutation SubmitResetPasswordFormMutation($email: String!) {
	requestPasswordReset(email: $email) {
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

	function onSubmit(values: z.infer<typeof submitResetPasswordSchema>) {
		commitMutation({
			variables: {
				email: values.email,
			},
			onCompleted() {
				setShowSuccessMessage(true);
			},
		});
	}
	return (
		<>
			<Card shadow="sm" className="p-6 space-y-6">
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
				<CardFooter className="w-full flex items-center justify-center">
					<Link href={links.login} className="cursor-pointer text-blue-500">
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
						color="secondary"
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
