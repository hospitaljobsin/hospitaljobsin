import { useRouter } from "@bprogress/next";
import { addToast, Button } from "@heroui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasskeyAuthenticationGenerateOptionsMutation } from "@/__generated__/PasskeyAuthenticationGenerateOptionsMutation.graphql";
import type { PasskeyAuthenticationMutation as PasskeyAuthenticationMutationType } from "@/__generated__/PasskeyAuthenticationMutation.graphql";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { useTurnstile } from "../TurnstileProvider";

const GenerateReauthenticationOptionsMutation = graphql`
  mutation PasskeyAuthenticationGenerateOptionsMutation($captchaToken: String!) {
    generateReauthenticationOptions(captchaToken: $captchaToken) {
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

const PasskeyAuthenticationMutation = graphql`
  mutation PasskeyAuthenticationMutation($authenticationResponse: JSON!, $captchaToken: String!) {
    requestSudoModeWithPasskey(authenticationResponse: $authenticationResponse, captchaToken: $captchaToken) {
      __typename
      ... on Account {
        __typename
      }
      ... on InvalidPasskeyAuthenticationCredentialError {
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

export default function PasskeyAuthentication({
	isDisabled,
	onAuthStart,
	onAuthEnd,
}: {
	isDisabled: boolean;
	onAuthStart: () => void;
	onAuthEnd: () => void;
}) {
	const params = useSearchParams();
	const router = useRouter();
	const redirectTo = getValidSudoModeRedirectURL(params.get("return_to"));
	const [
		commitPasskeyAuthenticateMutation,
		isPasskeyAuthenticateMutationInFlight,
	] = useMutation<PasskeyAuthenticationMutationType>(
		PasskeyAuthenticationMutation,
	);
	const [
		commitGenerateReauthenticationOptionsMutation,
		isGenerateReauthenticationOptionsMutationInFlight,
	] = useMutation<PasskeyAuthenticationGenerateOptionsMutation>(
		GenerateReauthenticationOptionsMutation,
	);

	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);
	const { executeCaptcha } = useTurnstile();

	async function handlePasskeyAuthentication() {
		onAuthStart();
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		setIsPasskeysPromptActive(true);
		const token = await executeCaptcha(
			"passkey_generate_authentication_options",
		);
		commitGenerateReauthenticationOptionsMutation({
			variables: {
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generateReauthenticationOptions.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					setIsPasskeysPromptActive(false);
					onAuthEnd();
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.generateReauthenticationOptions.__typename ===
					"GenerateAuthenticationOptionsSuccess"
				) {
					// login with passkey
					const authenticationOptions =
						response.generateReauthenticationOptions.authenticationOptions;

					startAuthentication({
						optionsJSON: JSON.parse(authenticationOptions),
					})
						.then((authenticationResponse) => {
							executeCaptcha("sudo_authenticate_passkey")
								.then((captchaToken) => {
									commitPasskeyAuthenticateMutation({
										variables: {
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											captchaToken: captchaToken,
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
											if (
												response.requestSudoModeWithPasskey.__typename ===
												"InvalidCaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");

												onAuthEnd();
											} else if (
												response.requestSudoModeWithPasskey.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												addToast({
													title: "Passkey authentication failed!",
													color: "danger",
												});
												onAuthEnd();
											} else if (
												response.requestSudoModeWithPasskey.__typename ===
												"WebAuthnChallengeNotFoundError"
											) {
												addToast({
													title:
														"An unexpected error occurred. Please try again.",
													color: "danger",
												});
												onAuthEnd();
											} else {
												router.replace(redirectTo);
											}
										},
										onError(error) {
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

	if (isPasskeysPromptActive) {
		return (
			<Button fullWidth size="lg" isLoading isDisabled={isDisabled}>
				Waiting for browser interaction
			</Button>
		);
	}

	return (
		<Button
			fullWidth
			startContent={<Fingerprint size={20} />}
			size="lg"
			isDisabled={isDisabled}
			onPress={handlePasskeyAuthentication}
			isLoading={
				isPasskeyAuthenticateMutationInFlight ||
				isGenerateReauthenticationOptionsMutationInFlight
			}
			spinnerPlacement="end"
		>
			Authenticate with passkey
		</Button>
	);
}
