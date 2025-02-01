"use client";

import links from "@/lib/links";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";
import type { ConfirmResetPasswordFormMutation as ConfirmResetPasswordFormMutationType } from "./__generated__/ConfirmResetPasswordFormMutation.graphql";

const ConfirmResetPasswordFormMutation = graphql`
  mutation ConfirmResetPasswordFormMutation($email: String!, $passwordResetToken: String!, $newPassword: String!) {
	resetPassword(email: $email, passwordResetToken: $passwordResetToken, newPassword: $newPassword) {
	  __typename
	  ... on Account {
		...AuthDropdownFragment
	  }
	  ... on InvalidPasswordResetTokenError {
		message
	  }
	  ... on PasswordNotStrongError {
		message
	  }
	}
  }
`;

const confirmResetPasswordSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long.")
		.refine((password) => /[a-z]/.test(password), {
			message: "Password must contain at least one lowercase letter.",
		})
		.refine((password) => /[A-Z]/.test(password), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((password) => /\d/.test(password), {
			message: "Password must contain at least one number.",
		})
		.refine((password) => /[!@#$%^&*()\-_=+]/.test(password), {
			message:
				"Password must contain at least one special character (!@#$%^&*()-_=+).",
		}),
});

export default function ConfirmResetPasswordForm() {
	const router = useRouter();
	const params = useParams<{ token: string }>();

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [commitMutation, isMutationInFlight] =
		useMutation<ConfirmResetPasswordFormMutationType>(
			ConfirmResetPasswordFormMutation,
		);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<z.infer<typeof confirmResetPasswordSchema>>({
		resolver: zodResolver(confirmResetPasswordSchema),
	});

	function onSubmit(values: z.infer<typeof confirmResetPasswordSchema>) {
		commitMutation({
			variables: {
				email: values.email,
				passwordResetToken: params.token,
				newPassword: values.password,
			},
			onCompleted(response) {
				if (
					response.resetPassword.__typename === "InvalidPasswordResetTokenError"
				) {
					setErrorMessage(response.resetPassword.message);
				} else if (
					response.resetPassword.__typename === "PasswordNotStrongError"
				) {
					setError("password", {
						message: response.resetPassword.message,
					});
				} else {
					router.replace(links.landing);
				}
			},
		});
	}
	return (
		<Card className="p-6 space-y-6">
			<CardHeader>
				<h1 className={"w-full text-center text-2xl"}>Reset your password</h1>
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
						<Input
							id="password"
							label="New Password"
							placeholder="Enter password"
							type={isPasswordVisible ? "text" : "password"}
							endContent={
								<button
									aria-label="toggle password visibility"
									className="focus:outline-none"
									type="button"
									onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								>
									{isPasswordVisible ? (
										<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
									) : (
										<EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
									)}
								</button>
							}
							{...register("password")}
							errorMessage={errors.password?.message}
							isInvalid={!!errors.password}
						/>
						<Button
							fullWidth
							isLoading={isSubmitting || isMutationInFlight}
							type="submit"
						>
							Reset Password
						</Button>
					</div>

					<div className="flex h-8 items-end space-x-1">
						<div
							className="flex h-8 items-end space-x-1"
							aria-live="polite"
							aria-atomic="true"
						>
							{errorMessage && (
								<p className="text-sm text-red-500">{errorMessage}</p>
							)}
						</div>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
