import {
	addToast,
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
} from "@heroui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { PasskeyTwoFactorAuthenticationGenerateOptionsMutation } from "@/__generated__/PasskeyTwoFactorAuthenticationGenerateOptionsMutation.graphql";
import type { PasskeyTwoFactorAuthenticationResetPasswordMutation as PasskeyTwoFactorAuthenticationResetPasswordMutationType } from "@/__generated__/PasskeyTwoFactorAuthenticationResetPasswordMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";

const GenerateAuthenticationOptionsMutation = graphql`
  mutation PasskeyTwoFactorAuthenticationGenerateOptionsMutation($captchaToken: String!) {
    generateAuthenticationOptions(captchaToken: $captchaToken) {
      __typename
      ... on InvalidCaptchaTokenError {
        message
      }

      ... on GenerateAuthenticationOptionsSuccess {
        authenticationOptions
      }
    }
  }
`;

const PasskeyTwoFactorAuthenticationResetPasswordMutation = graphql`
  mutation PasskeyTwoFactorAuthenticationResetPasswordMutation($email: String!, $passwordResetToken: String!, $authenticationResponse: JSON!, $captchaToken: String!) {
    verify2faPasswordResetWithPasskey(email: $email, passwordResetToken: $passwordResetToken, authenticationResponse: $authenticationResponse, captchaToken: $captchaToken) {
      __typename
      ... on PasswordResetToken {
        ...ResetPasswordViewFragment
      }
      ... on InvalidPasswordResetTokenError {
        message
      }
      ... on InvalidPasskeyAuthenticationCredentialError {
        message
      }
      ... on TwoFactorAuthenticationNotEnabledError {
        message
      }
      ... on InvalidCaptchaTokenError {
        message
      }
	  ... on WebAuthnChallengeNotFoundError {
		message
	  }
    }
  }
`;

export default function PasskeyTwoFactorAuthentication({
	email,
	resetToken,
	onComplete,
	isDisabled,
	onAuthStart,
	onAuthEnd,
	hasAuthenticator,
	onSwitchToAuthenticator,
}: {
	email: string;
	resetToken: string;
	onComplete: () => void;
	isDisabled: boolean;
	onAuthStart: () => void;
	onAuthEnd: () => void;
	hasAuthenticator?: boolean;
	onSwitchToAuthenticator?: () => void;
}) {
	const [
		commitPasskeyAuthenticateMutation,
		isPasskeyAuthenticateMutationInFlight,
	] = useMutation<PasskeyTwoFactorAuthenticationResetPasswordMutationType>(
		PasskeyTwoFactorAuthenticationResetPasswordMutation,
	);
	const [
		commitGenerateReauthenticationOptionsMutation,
		isGenerateReauthenticationOptionsMutationInFlight,
	] = useMutation<PasskeyTwoFactorAuthenticationGenerateOptionsMutation>(
		GenerateAuthenticationOptionsMutation,
	);
	const { executeCaptcha } = useTurnstile();
	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handlePasskeyAuthentication() {
		onAuthStart();
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		setIsPasskeysPromptActive(true);
		const token = await executeCaptcha(
			"reset_password_passkey_generate_authentication_options",
		);
		commitGenerateReauthenticationOptionsMutation({
			variables: {
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generateAuthenticationOptions.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					setIsPasskeysPromptActive(false);
					onAuthEnd();
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.generateAuthenticationOptions.__typename ===
					"GenerateAuthenticationOptionsSuccess"
				) {
					// login with passkey
					const authenticationOptions =
						response.generateAuthenticationOptions.authenticationOptions;

					startAuthentication({
						optionsJSON: JSON.parse(authenticationOptions),
					})
						.then((authenticationResponse) => {
							executeCaptcha("password_reset_authenticate_passkey")
								.then((captchaToken) => {
									commitPasskeyAuthenticateMutation({
										variables: {
											email: email,
											passwordResetToken: resetToken,
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											captchaToken: captchaToken,
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
											if (
												response.verify2faPasswordResetWithPasskey
													.__typename === "InvalidCaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");

												onAuthEnd();
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												addToast({
													title: "Passkey authentication failed!",
													color: "danger",
												});
												onAuthEnd();
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename === "InvalidPasswordResetTokenError"
											) {
												setErrorMessage(
													response.verify2faPasswordResetWithPasskey.message,
												);
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename ===
												"TwoFactorAuthenticationNotEnabledError"
											) {
												addToast({
													title:
														"An unexpected error occurred. Please try again.",
													color: "danger",
												});
												onComplete();
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename === "WebAuthnChallengeNotFoundError"
											) {
												addToast({
													title:
														"An unexpected error occurred. Please try again.",
													color: "danger",
												});

												onAuthEnd();
											} else {
												onComplete();
											}
										},
										onError() {
											addToast({
												title:
													"An unexpected error occurred. Please try again.",
												color: "danger",
											});
											setIsPasskeysPromptActive(false);
											onAuthEnd();
										},
										updater(store) {
											store.invalidateStore();
										},
									});
								})
								.catch((error) => {
									addToast({
										title: "Passkey authentication failed!",
										color: "danger",
									});
									setIsPasskeysPromptActive(false);
									onAuthEnd();
								});
						})
						.catch((error) => {
							addToast({
								title: "Passkey authentication failed!",
								color: "danger",
							});
							setIsPasskeysPromptActive(false);
							onAuthEnd();
						});
				}
			},
			onError: () => {
				addToast({
					title: "An unexpected error occurred. Please try again.",
					color: "danger",
				});
				setIsPasskeysPromptActive(false);
				onAuthEnd();
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
					Your account is protected by 2FA. Use your passkey to proceed.
				</p>
			</CardHeader>
			<CardBody>
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
					{isPasskeysPromptActive ? (
						<Button fullWidth size="lg" isDisabled={isDisabled} isLoading>
							Waiting for browser interaction
						</Button>
					) : (
						<Button
							fullWidth
							startContent={<Fingerprint size={20} />}
							size="lg"
							isDisabled={isDisabled}
							onPress={handlePasskeyAuthentication}
							spinnerPlacement="end"
						>
							Authenticate with passkey
						</Button>
					)}

					{hasAuthenticator && (
						<Button variant="light" onPress={onSwitchToAuthenticator} fullWidth>
							Use authenticator app instead
						</Button>
					)}
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
			</CardBody>
		</Card>
	);
}
