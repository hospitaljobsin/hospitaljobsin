"use client";

import { env } from "@/lib/env";
import links from "@/lib/links";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@lobehub/icons";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import type { LoginFormMutation as LoginFormMutationType } from "./__generated__/LoginFormMutation.graphql";

const LoginFormMutation = graphql`
  mutation LoginFormMutation($email: String!, $password: String!, $recaptchaToken: String!) {
    login(email: $email, password: $password, recaptchaToken: $recaptchaToken) {
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

	const redirectTo = params.get("return_to") || links.seekerLanding;

	const [commitMutation, isMutationInFlight] =
		useMutation<LoginFormMutationType>(LoginFormMutation);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		reValidateMode: "onBlur",
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
		const token = await executeRecaptcha("login");
		commitMutation({
			variables: {
				email: values.email,
				password: values.password,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (response.login.__typename === "InvalidCredentialsError") {
					setError("email", { message: response.login.message });
					setError("password", { message: response.login.message });
				} else if (response.login.__typename === "InvalidRecaptchaTokenError") {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else {
					window.location.href = redirectTo;
				}
			},
			updater(store) {
				store.invalidateStore();
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
								{...register("email")}
								errorMessage={errors.email?.message}
								isInvalid={!!errors.email}
							/>
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
								{...register("password")}
								errorMessage={errors.password?.message}
								isInvalid={!!errors.password}
								description={
									<div className="w-full flex justify-start">
										<Link
											href={links.resetPasswordSubmit}
											className="mt-2 cursor-pointer text-blue-500"
										>
											Forgot password?
										</Link>
									</div>
								}
							/>

							<Button
								fullWidth
								isLoading={isSubmitting || isMutationInFlight}
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
					<Button
						fullWidth
						variant="bordered"
						startContent={<Google.Color size={20} />}
						onPress={() => {
							window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(redirectTo)}`;
						}}
					>
						Sign in with Google
					</Button>
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
