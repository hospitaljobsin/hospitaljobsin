"use client";

import { env } from "@/lib/env";
import links from "@/lib/links";
import { getValidRedirectURL } from "@/lib/redirects";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@lobehub/icons";
import { startAuthentication } from "@simplewebauthn/browser";
import { EyeIcon, EyeOffIcon, FingerprintIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import type { LoginFormGenerateAuthenticationOptionsMutation } from "./__generated__/LoginFormGenerateAuthenticationOptionsMutation.graphql";
import type { LoginFormPasskeyMutation as LoginFormPasskeyMutationType } from "./__generated__/LoginFormPasskeyMutation.graphql";
import type { LoginFormPasswordMutation as LoginFormPasswordMutationType } from "./__generated__/LoginFormPasswordMutation.graphql";

const LoginFormPasswordMutation = graphql`
  mutation LoginFormPasswordMutation($email: String!, $password: String!, $recaptchaToken: String!) {
    loginWithPassword(email: $email, password: $password, recaptchaToken: $recaptchaToken) {
      __typename
	  ... on Account {
		__typename
	  }
      ... on InvalidCredentialsError {
        message
      }
	  ... on InvalidRecaptchaTokenError {
		message
	  }

	  ... on InvalidSignInMethodError {
		message
	  }
    }
  }
`;

const GenerateAuthenticationOptionsMutation = graphql`
  mutation LoginFormGenerateAuthenticationOptionsMutation($recaptchaToken: String!) {
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

const LoginFormPasskeyMutation = graphql`
  mutation LoginFormPasskeyMutation($authenticationResponse: JSON!, $recaptchaToken: String!) {
    loginWithPasskey(authenticationResponse: $authenticationResponse, recaptchaToken: $recaptchaToken) {
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

const loginSchema = z.object({
	email: z.string().min(1, "This field is required").email(),
	password: z.string().min(1, "This field is required"),
});

export default function LoginForm() {
	const router = useRouter();
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));

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
			router.replace(url.toString(), undefined, { showProgressBar: false });
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
		resolver: zodResolver(loginSchema),
		reValidateMode: "onChange",
	});

	const { executeRecaptcha } = useGoogleReCaptcha();

	function getOauth2ErrorMessage(errorCode: string): string {
		switch (errorCode) {
			case "unverified_email":
				return "Please verify your email before signing in.";
			default:
				return "An error occurred. Please try again.";
		}
	}

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeRecaptcha("login_password");
		commitPasswordLoginMutation({
			variables: {
				email: values.email,
				password: values.password,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.loginWithPassword.__typename === "InvalidCredentialsError"
				) {
					setError("email", { message: response.loginWithPassword.message });
					setError("password", { message: response.loginWithPassword.message });
				} else if (
					response.loginWithPassword.__typename === "InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.loginWithPassword.__typename === "InvalidSignInMethodError"
				) {
					addToast({
						title: "Invalid Sign In Method",
						color: "warning",
						timeout: 30_000,
						endContent: (
							<div className="w-full text-warning-400 text-sm">
								You've previously signed in with Google. Please sign in with
								Google or{" "}
								<Link className="underline" href={links.resetPasswordSubmit}>
									set a password
								</Link>
								.
							</div>
						),
						classNames: {
							base: "flex flex-col items-start gap-4",
						},
					});
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
					// login with passkey
					const authenticationOptions =
						response.generateAuthenticationOptions.authenticationOptions;

					startAuthentication({
						optionsJSON: JSON.parse(authenticationOptions),
					})
						.then((authenticationResponse) => {
							executeRecaptcha("login_passkey")
								.then((recaptchaToken) => {
									commitPasskeyLoginMutation({
										variables: {
											authenticationResponse: JSON.stringify(
												authenticationResponse,
											),
											recaptchaToken: recaptchaToken,
										},
										onCompleted(response) {
											if (
												response.loginWithPasskey.__typename ===
												"InvalidRecaptchaTokenError"
											) {
												// handle recaptcha failure
												alert("Recaptcha failed. Please try again.");
											} else if (
												response.loginWithPasskey.__typename ===
												"InvalidPasskeyAuthenticationCredentialError"
											) {
												// TODO: show a toast here
												alert(
													"Invalid passkey registration credential. Please try again.",
												);
											} else if (
												response.loginWithPasskey.__typename ===
												"WebAuthnChallengeNotFoundError"
											) {
												// TODO: show a toast here
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
									console.error(error);
									// TODO: show toast here
								});
						})
						.catch((error) => {
							// TODO: show toast here
						});
				}
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
								type="email"
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
									isGenerateAuthenticationOptionsMutationInFlight
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
						<Button
							fullWidth
							variant="bordered"
							startContent={<FingerprintIcon size={20} />}
							onPress={handlePasskeyLogin}
							spinnerPlacement="end"
							isLoading={
								isPasskeyLoginMutationInFlight ||
								isGenerateAuthenticationOptionsMutationInFlight
							}
						>
							Sign in with passkey
						</Button>
						<Button
							fullWidth
							variant="bordered"
							startContent={<Google.Color size={20} />}
							isDisabled={
								isPasswordLoginMutationInFlight ||
								isPasskeyLoginMutationInFlight ||
								isGenerateAuthenticationOptionsMutationInFlight
							}
							onPress={() => {
								window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(redirectTo)}`;
							}}
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
