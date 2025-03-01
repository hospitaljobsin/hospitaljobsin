import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { Button } from "@heroui/react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasskeyAuthenticationGenerateOptionsMutation } from "./__generated__/PasskeyAuthenticationGenerateOptionsMutation.graphql";
import type { PasskeyAuthenticationMutation as PasskeyAuthenticationMutationType } from "./__generated__/PasskeyAuthenticationMutation.graphql";

const GenerateAuthenticationOptionsMutation = graphql`
  mutation PasskeyAuthenticationGenerateOptionsMutation($recaptchaToken: String!) {
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

export default function PasskeyAuthentication() {
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
		commitGenerateAuthenticationOptionsMutation,
		isGenerateAuthenticationOptionsMutationInFlight,
	] = useMutation<PasskeyAuthenticationGenerateOptionsMutation>(
		GenerateAuthenticationOptionsMutation,
	);

	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();

	async function handlePasskeyAuthentication() {
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeRecaptcha(
			"passkey_generate_authentication_options",
		);
		commitGenerateAuthenticationOptionsMutation({
			variables: {
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generateAuthenticationOptions.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.generateAuthenticationOptions.__typename ===
					"GenerateAuthenticationOptionsSuccess"
				) {
					setIsPasskeysPromptActive(true);
					// login with passkey
					const authenticationOptions =
						response.generateAuthenticationOptions.authenticationOptions;

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
											} else if (
												response.requestSudoModeWithPasskey.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												// TODO: show a toast here
												alert(
													"Invalid passkey registration credential. Please try again.",
												);
											} else if (
												response.requestSudoModeWithPasskey.__typename ===
												"WebAuthnChallengeNotFoundError"
											) {
												// TODO: show a toast here
											} else {
												router.replace(redirectTo);
											}
										},
										updater(store) {
											store.invalidateStore();
										},
									});
								})
								.catch((error) => {
									console.error(error);
									// TODO: show toast here
								});
						})
						.catch((error) => {
							// TODO: show toast here
							setIsPasskeysPromptActive(false);
						});
				}
			},
		});
	}

	return (
		<Button
			fullWidth
			startContent={<Fingerprint size={20} />}
			variant="ghost"
			size="lg"
			onPress={handlePasskeyAuthentication}
			isLoading={
				isPasskeyAuthenticateMutationInFlight ||
				isGenerateAuthenticationOptionsMutationInFlight ||
				isPasskeysPromptActive
			}
			spinnerPlacement="end"
		>
			Authenticate with passkey
		</Button>
	);
}
