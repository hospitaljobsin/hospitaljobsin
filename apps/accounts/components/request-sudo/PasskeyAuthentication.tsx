import type { PasskeyAuthenticationGenerateOptionsMutation } from "@/__generated__/PasskeyAuthenticationGenerateOptionsMutation.graphql";
import type { PasskeyAuthenticationMutation as PasskeyAuthenticationMutationType } from "@/__generated__/PasskeyAuthenticationMutation.graphql";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { useRouter } from "@bprogress/next";
import { Button, addToast } from "@heroui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { useTurnstile } from "../TurnstileProvider";

const GenerateReauthenticationOptionsMutation = graphql`
  mutation PasskeyAuthenticationGenerateOptionsMutation($recaptchaToken: String!) {
    generateReauthenticationOptions(recaptchaToken: $recaptchaToken) {
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

const PasskeyAuthenticationMutation = graphql`
  mutation PasskeyAuthenticationMutation($authenticationResponse: JSON!, $recaptchaToken: String!) {
    requestSudoModeWithPasskey(authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {
      __typename
      ... on Account {
        __typename
      }
      ... on InvalidPasskeyAuthenticationCredentialError {
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
	const { executeRecaptcha } = useTurnstile();

	async function handlePasskeyAuthentication() {
		onAuthStart();
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		setIsPasskeysPromptActive(true);
		const token = await executeRecaptcha(
			"passkey_generate_authentication_options",
		);
		commitGenerateReauthenticationOptionsMutation({
			variables: {
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generateReauthenticationOptions.__typename ===
					"InvalidRecaptchaTokenError"
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
							executeRecaptcha("sudo_authenticate_passkey")
								.then((recaptchaToken) => {
									commitPasskeyAuthenticateMutation({
										variables: {
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											recaptchaToken: recaptchaToken,
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
											if (
												response.requestSudoModeWithPasskey.__typename ===
												"InvalidRecaptchaTokenError"
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
