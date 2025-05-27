"use client";

import type { LoginFormGenerateAuthenticationOptionsMutation } from "@/__generated__/LoginFormGenerateAuthenticationOptionsMutation.graphql";
import type { LoginFormPasskeyMutation as LoginFormPasskeyMutationType } from "@/__generated__/LoginFormPasskeyMutation.graphql";
import type { LoginFormPasswordMutation as LoginFormPasswordMutationType } from "@/__generated__/LoginFormPasswordMutation.graphql";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { getValidRedirectURL } from "@/lib/redirects";
import { useRouter } from "@bprogress/next";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
	addToast,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Google } from "@lobehub/icons";
import { startAuthentication } from "@simplewebauthn/browser";
import { EyeIcon, EyeOffIcon, FingerprintIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import { useTurnstile } from "../TurnstileProvider";

const LoginFormPasswordMutation = graphql`
  mutation LoginFormPasswordMutation($email: String!, $password: String!, $captchaToken: String!) {
    loginWithPassword(email: $email, password: $password, captchaToken: $captchaToken) {
      __typename
      ... on InvalidCredentialsError {
        message
      }
	  ... on InvalidCaptchaTokenError {
		message
	  }

	  ... on InvalidAuthenticationProviderError {
		message
		availableProviders
	  }

	  ... on TwoFactorAuthenticationRequiredError {
		message
	  }
    }
  }
`;

const GenerateAuthenticationOptionsMutation = graphql`
  mutation LoginFormGenerateAuthenticationOptionsMutation($captchaToken: String!) {
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

const LoginFormPasskeyMutation = graphql`
  mutation LoginFormPasskeyMutation($authenticationResponse: JSON!, $captchaToken: String!) {
    loginWithPasskey(authenticationResponse: $authenticationResponse, captchaToken: $captchaToken) {
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

const loginSchema = z.object({
	email: z.string().check(z.minLength(1, "This field is required"), z.email()),
	password: z.string().check(z.minLength(1, "This field is required")),
});

export default function LoginForm() {
	const router = useRouter();
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));

	const [isPasskeysPromptActive, setIsPasskeysPromptActive] = useState(false);

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const oauth2Error = params.get("oauth2_error");

	const [oauth2ErrorMessage, setOauth2ErrorMessage] = useState<null | string>(
		null,
	);

	useEffect(() => {
		if (oauth2Error !== null) {
			setOauth2ErrorMessage(oauth2Error);
			const url = new URL(window.location.href);
			url.searchParams.delete("oauth2_error");
			router.replace(url.toString(), undefined, { showProgress: false });
		}
	}, [oauth2Error, router]);

	const [commitPasswordLoginMutation, isPasswordLoginMutationInFlight] =
		useMutation<LoginFormPasswordMutationType>(LoginFormPasswordMutation);
	const [commitPasskeyLoginMutation, isPasskeyLoginMutationInFlight] =
		useMutation<LoginFormPasskeyMutationType>(LoginFormPasskeyMutation);
	const [
		commitGenerateAuthenticationOptionsMutation,
		isGenerateAuthenticationOptionsMutationInFlight,
	] = useMutation<LoginFormGenerateAuthenticationOptionsMutation>(
		GenerateAuthenticationOptionsMutation,
	);
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof loginSchema>>({
		resolver: standardSchemaResolver(loginSchema),
		reValidateMode: "onChange",
	});

	const { executeCaptcha } = useTurnstile();

	function getOauth2ErrorMessage(errorCode: string): string {
		switch (errorCode) {
			case "unverified_email":
				return "Please verify your email before signing in.";
			default:
				return "An error occurred. Please try again.";
		}
	}

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeCaptcha("login_password");
		commitPasswordLoginMutation({
			variables: {
				email: values.email,
				password: values.password,
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.loginWithPassword.__typename === "InvalidCredentialsError"
				) {
					setError("email", { message: response.loginWithPassword.message });
					setError("password", { message: response.loginWithPassword.message });
				} else if (
					response.loginWithPassword.__typename === "InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.loginWithPassword.__typename ===
					"InvalidAuthenticationProviderError"
				) {
					const providers = response.loginWithPassword.availableProviders;
					let message = "You've previously signed in with ";

					if (
						providers.includes("OAUTH_GOOGLE") &&
						providers.includes("WEBAUTHN_CREDENTIAL")
					) {
						message +=
							"Google or a passkey. Please use one of these methods to sign in.";
					} else if (providers.includes("OAUTH_GOOGLE")) {
						message += "Google. Please sign in with Google.";
					} else if (providers.includes("WEBAUTHN_CREDENTIAL")) {
						message += "passkey. Please sign in with passkey.";
					}

					addToast({
						title: "Invalid Sign In Method",
						color: "warning",
						timeout: 30_000,
						endContent: (
							<div className="w-full text-warning-400 text-sm">{message}</div>
						),
						classNames: {
							base: "flex flex-col items-start gap-4",
						},
					});
				} else if (
					response.loginWithPassword.__typename ===
					"TwoFactorAuthenticationRequiredError"
				) {
					router.push(links.twoFactorAuthentication(params.get("return_to")));
				} else {
					window.location.href = redirectTo;
				}
			},
			updater(store) {
				store.invalidateStore();
			},
		});
	}

	async function handlePasskeyLogin() {
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		setIsPasskeysPromptActive(true);
		const token = await executeCaptcha(
			"passkey_generate_authentication_options",
		);
		commitGenerateAuthenticationOptionsMutation({
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
							executeCaptcha("login_passkey")
								.then((captchaToken) => {
									commitPasskeyLoginMutation({
										variables: {
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											captchaToken: captchaToken,
										},
										onError() {
											addToast({
												title:
													"An unexpected error occurred. Please try again.",
												color: "danger",
											});
											setIsPasskeysPromptActive(false);
										},
										onCompleted(response) {
											setIsPasskeysPromptActive(false);
											if (
												response.loginWithPasskey.__typename ===
												"InvalidCaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");
											} else if (
												response.loginWithPasskey.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												addToast({
													title: "Passkey authentication failed!",
													color: "danger",
												});
											} else if (
												response.loginWithPasskey.__typename ===
												"WebAuthnChallengeNotFoundError"
											) {
												addToast({
													title:
														"An unexpected error occurred. Please try again.",
													color: "danger",
												});
											} else {
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
										title: "Passkey authentication failed!",
										color: "danger",
									});
									setIsPasskeysPromptActive(false);
								});
						})
						.catch((error) => {
							addToast({
								title: "Passkey authentication failed!",
								color: "danger",
							});
							setIsPasskeysPromptActive(false);
						});
				}
			},
			onError() {
				addToast({
					title: "An unexpected error occurred. Please try again.",
					color: "danger",
				});
				setIsPasskeysPromptActive(false);
			},
		});
	}

	return (
		<>
			<Alert
				isVisible={oauth2ErrorMessage !== null}
				onClose={() => setOauth2ErrorMessage(null)}
				hideIcon
				description={getOauth2ErrorMessage(oauth2ErrorMessage || "")}
				color="danger"
				className="mb-4"
			/>
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<h1 className="text-2xl text-center w-full">Log in to continue</h1>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
						<div className="w-full flex flex-col gap-6">
							<Input
								id="email"
								label="Email Address"
								autoComplete="email"
								placeholder="Enter your email address"
								type="text"
								{...register("email", {
									onChange: () => clearErrors(["email", "password"]),
								})}
								errorMessage={errors.email?.message}
								isInvalid={!!errors.email}
							/>
							<div className="w-full flex flex-col">
								<Input
									id="password"
									label="Password"
									placeholder="Enter password"
									autoComplete="current-password"
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
									{...register("password", {
										onChange: () => clearErrors(["email", "password"]),
									})}
									errorMessage={errors.password?.message}
									isInvalid={!!errors.password}
								/>
								<div className="w-full flex justify-start text-tiny px-1">
									<Link
										href={links.resetPasswordSubmit}
										className="mt-2 cursor-pointer text-blue-500"
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<Button
								fullWidth
								isDisabled={
									isPasskeyLoginMutationInFlight ||
									isGenerateAuthenticationOptionsMutationInFlight ||
									isPasskeysPromptActive
								}
								isLoading={isSubmitting || isPasswordLoginMutationInFlight}
								type="submit"
							>
								Log in
							</Button>
						</div>
					</form>
				</CardBody>
				<CardFooter className="flex flex-col w-full gap-8">
					<div className="w-full flex items-center justify-center gap-6">
						<Divider className="flex-1" />
						<p>or</p>
						<Divider className="flex-1" />
					</div>
					<div className="flex flex-col w-full gap-6">
						{isPasskeysPromptActive ? (
							<Button fullWidth variant="bordered" isLoading>
								Waiting for browser interaction
							</Button>
						) : (
							<Button
								fullWidth
								variant="bordered"
								startContent={<FingerprintIcon size={20} />}
								onPress={handlePasskeyLogin}
								spinnerPlacement="end"
								isDisabled={isPasswordLoginMutationInFlight}
							>
								Sign in with passkey
							</Button>
						)}

						<Button
							fullWidth
							as="a"
							href={`${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(redirectTo)}`}
							target="_self"
							variant="bordered"
							startContent={<Google.Color size={20} />}
							isDisabled={
								isPasswordLoginMutationInFlight ||
								isPasskeyLoginMutationInFlight ||
								isGenerateAuthenticationOptionsMutationInFlight ||
								isPasskeysPromptActive
							}
						>
							Sign in with Google
						</Button>
					</div>
					<div className="flex justify-center w-full">
						<Link
							href={links.signup(params.get("return_to"))}
							className="mt-2 cursor-pointer text-center text-blue-500 text-small sm:text-sm"
						>
							{"Don't have an account? "} Sign up.
						</Link>
					</div>
				</CardFooter>
			</Card>
		</>
	);
}
