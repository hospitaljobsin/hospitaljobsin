"use client";

import links from "@/lib/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
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
	const router = useRouter();
	const [commitMutation, isMutationInFlight] =
		useMutation<SubmitResetPasswordFormMutationType>(SubmitResetPasswordFormMutation);
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
				router.replace(links.resetPasswordConfirm);
			},
		});
	}
	return (
		<Card shadow="sm" className="p-6 space-y-6">
			<CardHeader>
				<h1 className="text-center text-2xl w-full">
					Request a Password Reset
				</h1>
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
						<Button fullWidth isLoading={isSubmitting || isMutationInFlight} type="submit">
							Send Code
						</Button>
					</div>					
				</form>
			</CardBody>
		</Card>
	);
}
