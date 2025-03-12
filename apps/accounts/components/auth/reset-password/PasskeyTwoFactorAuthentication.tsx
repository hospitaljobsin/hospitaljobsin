import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { graphql, useMutation } from "react-relay";
import type { PasskeyTwoFactorAuthenticationGenerateOptionsMutation } from "./__generated__/PasskeyTwoFactorAuthenticationGenerateOptionsMutation.graphql";
import type { PasskeyTwoFactorAuthenticationResetPasswordMutation as PasskeyTwoFactorAuthenticationResetPasswordMutationType } from "./__generated__/PasskeyTwoFactorAuthenticationResetPasswordMutation.graphql";

const GenerateAuthenticationOptionsMutation = graphql`
  mutation PasskeyTwoFactorAuthenticationGenerateOptionsMutation($recaptchaToken: String!) {
    generateAuthenticationOptions(recaptchaToken: $recaptchaToken) {
      __typename
      ... on InvalidRecaptchaTokenError {
        message
      }

      ... on GenerateAuthenticationOptionsSuccess {
        authenticationOptions
      }
    }
  }
`;

const PasskeyTwoFactorAuthenticationResetPasswordMutation = graphql`
  mutation PasskeyTwoFactorAuthenticationResetPasswordMutation($email: String!, $passwordResetToken: String!, $authenticationResponse: JSON!, $recaptchaToken: String!) {
    verify2faPasswordResetWithPasskey(email: $email, passwordResetToken: $passwordResetToken, authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {
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
      ... on InvalidRecaptchaTokenError {
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
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function handlePasskeyAuthentication() {
		onAuthStart();
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		setIsPasskeysPromptActive(true);
		const token = await executeRecaptcha(
			"reset_password_passkey_generate_authentication_options",
		);
		commitGenerateReauthenticationOptionsMutation({
			variables: {
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generateAuthenticationOptions.__typename ===
					"InvalidRecaptchaTokenError"
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
							executeRecaptcha("password_reset_authenticate_passkey")
								.then((recaptchaToken) => {
									commitPasskeyAuthenticateMutation({
										variables: {
											email: email,
											passwordResetToken: resetToken,
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											recaptchaToken: recaptchaToken,
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
											if (
												response.verify2faPasswordResetWithPasskey
													.__typename === "InvalidRecaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");

												onAuthEnd();
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												// TODO: show a toast here
												alert(
													"Invalid passkey registration credential. Please try again.",
												);
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
												// TODO: show a toast
												onComplete();
											} else if (
												response.verify2faPasswordResetWithPasskey
													.__typename === "WebAuthnChallengeNotFoundError"
											) {
												// TODO: show a toast here

												onAuthEnd();
											} else {
												onComplete();
											}
										},
										onError() {
											setIsPasskeysPromptActive(false);
											onAuthEnd();
										},
										updater(store) {
											store.invalidateStore();
										},
									});
								})
								.catch((error) => {
									setIsPasskeysPromptActive(false);
									onAuthEnd();
									// TODO: show toast here
								});
						})
						.catch((error) => {
							// TODO: show toast here
							setIsPasskeysPromptActive(false);
							onAuthEnd();
						});
				}
			},
			onError: () => {
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
