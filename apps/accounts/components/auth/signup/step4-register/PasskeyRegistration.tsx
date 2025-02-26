"use client";

import { getValidRedirectURL } from "@/lib/redirects";
import { Alert, Button } from "@heroui/react";
import { startRegistration } from "@simplewebauthn/browser";
import { useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import SignupContext from "../SignupContext";
import type { PasskeyRegistrationMutation } from "./__generated__/PasskeyRegistrationMutation.graphql";
import type { PasskeyRegistrationOptionsMutation } from "./__generated__/PasskeyRegistrationOptionsMutation.graphql";

const GeneratePasskeyRegistrationOptionsMutation = graphql`
  mutation PasskeyRegistrationOptionsMutation(
    $email: String!
    $fullName: String!
    $recaptchaToken: String!
  ) {
    generatePasskeyRegistrationOptions(
      email: $email
      fullName: $fullName
      recaptchaToken: $recaptchaToken
    ) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidRecaptchaTokenError {
        message
      }
      ... on GeneratePasskeyRegistrationOptionsSuccess {
        registrationOptions
	    }
    }
  }
`;

const RegisterWithPasskeyMutation = graphql`
  mutation PasskeyRegistrationMutation(
    $email: String!
    $emailVerificationToken: String!
    $passkeyRegistrationResponse: JSON!
    $fullName: String!
    $recaptchaToken: String!
  ) {
    registerWithPasskey(
      email: $email
      emailVerificationToken: $emailVerificationToken
      passkeyRegistrationResponse: $passkeyRegistrationResponse
      fullName: $fullName
      recaptchaToken: $recaptchaToken
    ) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidEmailVerificationTokenError {
        message
      }
      ... on InvalidRecaptchaTokenError {
        message
      }
      ... on InvalidPasskeyRegistrationCredentialError {
        message
	  }
    }
  }
`;

export default function PasskeyRegistration() {
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));
	const { send } = SignupContext.useActorRef();
	const emailVerificationToken = SignupContext.useSelector(
		(state) => state.context.emailVerificationToken,
	);
	const email = SignupContext.useSelector((state) => state.context.email);
	const fullName = SignupContext.useSelector((state) => state.context.fullName);
	const { executeRecaptcha } = useGoogleReCaptcha();

	const [commitRegister, isCommitRegisterInFlight] =
		useMutation<PasskeyRegistrationMutation>(RegisterWithPasskeyMutation);

	const [
		commitGenerateRegistrationOptions,
		isGenerateRegistrationOptionsInFlight,
	] = useMutation<PasskeyRegistrationOptionsMutation>(
		GeneratePasskeyRegistrationOptionsMutation,
	);

	const handleSubmit = async () => {
		if (!executeRecaptcha) return;

		const token = await executeRecaptcha("register");

		commitGenerateRegistrationOptions({
			variables: {
				email,
				fullName,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generatePasskeyRegistrationOptions.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.generatePasskeyRegistrationOptions.__typename ===
					"EmailInUseError"
				) {
					send({
						type: "SET_EMAIL_ERROR",
						message: response.generatePasskeyRegistrationOptions.message,
					});
				} else if (
					response.generatePasskeyRegistrationOptions.__typename ===
					"GeneratePasskeyRegistrationOptionsSuccess"
				) {
					// register with passkey
					const registrationOptions =
						response.generatePasskeyRegistrationOptions.registrationOptions;

					startRegistration({
						optionsJSON: JSON.parse(registrationOptions),
					})
						.then((registrationResponse) => {
							commitRegister({
								variables: {
									email,
									emailVerificationToken,
									fullName,
									passkeyRegistrationResponse:
										JSON.stringify(registrationResponse),
									recaptchaToken: token,
								},
								onCompleted(response) {
									if (
										response.registerWithPasskey.__typename ===
										"EmailInUseError"
									) {
										// we've hit the race condition failsafe.
										// show an unexpected error message and reset the form
										send({
											type: "SET_EMAIL_ERROR",
											message: response.registerWithPasskey.message,
										});
									} else if (
										response.registerWithPasskey.__typename ===
										"InvalidEmailVerificationTokenError"
									) {
										send({
											type: "SET_VERIFICATION_TOKEN_ERROR",
											message: response.registerWithPasskey.message,
										});
									} else if (
										response.registerWithPasskey.__typename ===
										"InvalidRecaptchaTokenError"
									) {
										// handle recaptcha failure
										alert("Recaptcha failed. Please try again.");
									} else if (
										response.registerWithPasskey.__typename ===
										"InvalidPasskeyRegistrationCredentialError"
									) {
										alert(
											"Invalid passkey registration credential. Please try again.",
										);
									} else {
										// redirect to redirect URL
										window.location.href = redirectTo;
									}
								},
								updater(store) {
									store.invalidateStore();
								},
							});
						})
						.catch((error) => {
							// TODO: show toast here
						});
				}
			},
		});
	};

	return (
		<div className="w-full flex flex-col gap-6">
			<Alert variant="faded" color="primary">
				Passkeys are the new replacement for passwords, designed to give you
				access to apps in an easier and more secure way.
			</Alert>
			<Button
				onPress={handleSubmit}
				isLoading={
					isCommitRegisterInFlight || isGenerateRegistrationOptionsInFlight
				}
				fullWidth
			>
				Create account
			</Button>
		</div>
	);
}
