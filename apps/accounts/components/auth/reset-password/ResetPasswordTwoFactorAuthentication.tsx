import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import type { ResetPasswordTwoFactorAuthenticationMutation as ResetPasswordTwoFactorAuthenticationMutationType } from "./__generated__/ResetPasswordTwoFactorAuthenticationMutation.graphql";

const ResetPasswordTwoFactorAuthenticationMutation = graphql`
  mutation ResetPasswordTwoFactorAuthenticationMutation($email: String!, $passwordResetToken: String!, $twoFactorToken: String!) {
    verify2faPasswordReset(email: $email, passwordResetToken: $passwordResetToken, twoFactorToken: $twoFactorToken) {
      __typename
      ... on PasswordResetToken {
        ...ResetPasswordViewFragment
      }
      ... on InvalidPasswordResetTokenError {
        message
      }
      ... on InvalidCredentialsError {
        message
      }
      ... on TwoFactorAuthenticationNotEnabledError {
        message
      }
    }
  }
`;

const resetPassword2faSchema = z.object({
	token: z.string().min(1, "This field is required"),
});

export default function ResetPasswordTwoFactorAuthentication({
	email,
	resetToken,
	onComplete,
}: { email: string; resetToken: string; onComplete: () => void }) {
	const router = useRouter();
	const [commitMutation, isMutationInFlight] =
		useMutation<ResetPasswordTwoFactorAuthenticationMutationType>(
			ResetPasswordTwoFactorAuthenticationMutation,
		);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<z.infer<typeof resetPassword2faSchema>>({
		resolver: zodResolver(resetPassword2faSchema),
	});

	function onSubmit(values: z.infer<typeof resetPassword2faSchema>) {
		commitMutation({
			variables: {
				email: email,
				passwordResetToken: resetToken,
				twoFactorToken: values.token,
			},
			onCompleted(response) {
				if (
					response.verify2faPasswordReset.__typename ===
					"InvalidPasswordResetTokenError"
				) {
					setErrorMessage(response.verify2faPasswordReset.message);
				} else if (
					response.verify2faPasswordReset.__typename ===
					"InvalidCredentialsError"
				) {
					setError("token", {
						message: response.verify2faPasswordReset.message,
					});
				} else if (
					response.verify2faPasswordReset.__typename ===
					"TwoFactorAuthenticationNotEnabledError"
				) {
					// TODO: show a toast
					onComplete();
				} else {
					onComplete();
				}
			},
		});
	}

	return (
		<Card className="p-6 space-y-6" shadow="none">
			<CardHeader className="w-full flex flex-col gap-6">
				<h1 className={"w-full text-center text-2xl"}>
					Two Factor Authentication
				</h1>
				<p className="text-center text-sm text-foreground-400">
					Your account is protected by 2FA. Enter the code from your
					authenticator app, or a recovery code to proceed.
				</p>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="w-full flex flex-col gap-6">
						<Input
							id="email"
							label="Email Address"
							placeholder="Enter your email address"
							type="email"
							value={email || ""}
							isReadOnly
							variant="faded"
						/>
						<Controller
							control={control}
							name="token"
							render={({ field }) => (
								<Input
									{...field}
									label="2FA Code"
									description="Enter your Authentication or Recovery Code"
									errorMessage={errors.token?.message}
									isInvalid={!!errors.token}
									placeholder="XXXXXX or XXXX-XXXX"
								/>
							)}
						/>
						<Button
							fullWidth
							isLoading={isSubmitting || isMutationInFlight}
							type="submit"
						>
							Verify Code
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
