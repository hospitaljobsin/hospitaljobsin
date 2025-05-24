"use client";

import { Alert, addToast, Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { startRegistration } from "@simplewebauthn/browser";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import type { PasskeyRegistrationMutation } from "@/__generated__/PasskeyRegistrationMutation.graphql";
import type { PasskeyRegistrationOptionsMutation } from "@/__generated__/PasskeyRegistrationOptionsMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";
import { getValidRedirectURL } from "@/lib/redirects";
import SignupContext from "../SignupContext";

const GeneratePasskeyRegistrationOptionsMutation = graphql`
  mutation PasskeyRegistrationOptionsMutation(
    $email: String!
    $fullName: String!
    $captchaToken: String!
  ) {
    generatePasskeyRegistrationOptions(
      email: $email
      fullName: $fullName
      captchaToken: $captchaToken
    ) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidCaptchaTokenError {
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
	$passkeyNickname: String!
    $fullName: String!
    $captchaToken: String!
  ) {
    registerWithPasskey(
      email: $email
      emailVerificationToken: $emailVerificationToken
      passkeyRegistrationResponse: $passkeyRegistrationResponse
	  passkeyNickname: $passkeyNickname
      fullName: $fullName
      captchaToken: $captchaToken
    ) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidEmailVerificationTokenError {
        message
      }
      ... on InvalidCaptchaTokenError {
        message
      }
      ... on InvalidPasskeyRegistrationCredentialError {
        message
	  }
    }
  }
`;

const passkeyRegistrationSchema = z.object({
	nickname: z
		.string()
		.check(
			z.minLength(1, "This field is required"),
			z.maxLength(75, "Nickname cannot exceed 75 characters"),
		),
});

export default function PasskeyRegistration() {
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));
	const { send } = SignupContext.useActorRef();
	const emailVerificationToken = SignupContext.useSelector(
		(state) => state.context.emailVerificationToken,
	);
	const email = SignupContext.useSelector((state) => state.context.email);
	const fullName = SignupContext.useSelector((state) => state.context.fullName);
	const { executeCaptcha } = useTurnstile();

	const [commitRegister, isCommitRegisterInFlight] =
		useMutation<PasskeyRegistrationMutation>(RegisterWithPasskeyMutation);

	const [
		commitGenerateRegistrationOptions,
		isGenerateRegistrationOptionsInFlight,
	] = useMutation<PasskeyRegistrationOptionsMutation>(
		GeneratePasskeyRegistrationOptionsMutation,
	);

	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof passkeyRegistrationSchema>>({
		resolver: standardSchemaResolver(passkeyRegistrationSchema),
		defaultValues: { nickname: "My Passkey" },
	});

	const onSubmit = async (
		values: z.infer<typeof passkeyRegistrationSchema>,
	) => {
		if (!executeCaptcha) return;

		setIsPasskeysPromptActive(true);

		const token = await executeCaptcha("passkey_generate_registration_options");

		commitGenerateRegistrationOptions({
			variables: {
				email,
				fullName,
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.generatePasskeyRegistrationOptions.__typename ===
					"InvalidCaptchaTokenError"
				) {
					setIsPasskeysPromptActive(false);
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.generatePasskeyRegistrationOptions.__typename ===
					"EmailInUseError"
				) {
					setIsPasskeysPromptActive(false);
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
							executeCaptcha("passkey_register")
								.then((captchaToken) => {
									commitRegister({
										variables: {
											email,
											emailVerificationToken,
											fullName,
											passkeyRegistrationResponse:
												JSON.stringify(registrationResponse),
											passkeyNickname: values.nickname,
											captchaToken: captchaToken,
										},
										onError(error) {
											console.error(error);
											setIsPasskeysPromptActive(false);
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
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
												"InvalidCaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");
											} else if (
												response.registerWithPasskey.__typename ===
												"InvalidPasskeyRegistrationCredentialError"
											) {
												addToast({
													title: "Passkey creation failed!",
													color: "danger",
												});
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
									addToast({
										title: "Passkey creation failed!",
										color: "danger",
									});
									setIsPasskeysPromptActive(false);
									console.error(error);
								});
						})
						.catch((error) => {
							addToast({
								title: "Passkey creation failed!",
								color: "danger",
							});
							setIsPasskeysPromptActive(false);
							console.error(error);
						});
				}
			},
			onError(error) {
				addToast({
					title: "An unexpected error occurred. Please try again.",
					color: "danger",
				});
				setIsPasskeysPromptActive(false);
				console.error(error);
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<Alert variant="faded" color="primary">
					Passkeys are the new replacement for passwords, designed to give you
					access to apps in an easier and more secure way.
				</Alert>
				<Input
					label="Nickname"
					placeholder="My Screen Lock"
					{...register("nickname")}
					errorMessage={errors.nickname?.message}
					isInvalid={!!errors.nickname}
					description="Nicknames help identify your passkeys"
				/>
				{isPasskeysPromptActive ? (
					<Button fullWidth size="lg" isLoading>
						Waiting for browser interaction
					</Button>
				) : (
					<Button
						type="submit"
						isLoading={
							isSubmitting ||
							isCommitRegisterInFlight ||
							isGenerateRegistrationOptionsInFlight
						}
						fullWidth
					>
						Create account
					</Button>
				)}
			</div>
		</form>
	);
}
