"use client";

import links from "@/lib/links";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { Button, Input, addToast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import type { PasswordAuthenticationMutation as PasswordAuthenticationMutationType } from "./__generated__/PasswordAuthenticationMutation.graphql";

const PasswordAuthenticationMutation = graphql`
  mutation PasswordAuthenticationMutation($password: String!, $recaptchaToken: String!) {
    requestSudoModeWithPassword(password: $password, recaptchaToken: $recaptchaToken) {
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

const passwordAuthenticationSchema = z.object({
	password: z.string().min(1, "This field is required"),
});

export default function PasswordAuthentication() {
	const params = useSearchParams();
	const redirectTo = getValidSudoModeRedirectURL(params.get("return_to"));

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [commitPasswordLoginMutation, isPasswordLoginMutationInFlight] =
		useMutation<PasswordAuthenticationMutationType>(
			PasswordAuthenticationMutation,
		);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof passwordAuthenticationSchema>>({
		resolver: zodResolver(passwordAuthenticationSchema),
	});

	const { executeRecaptcha } = useGoogleReCaptcha();

	async function onSubmit(
		values: z.infer<typeof passwordAuthenticationSchema>,
	) {
		if (!executeRecaptcha) {
			console.log("Recaptcha not loaded");
			return;
		}
		const token = await executeRecaptcha("login_password");
		commitPasswordLoginMutation({
			variables: {
				password: values.password,
				recaptchaToken: token,
			},
			onCompleted(response) {
				if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidCredentialsError"
				) {
					setError("password", {
						message: response.requestSudoModeWithPassword.message,
					});
				} else if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidSignInMethodError"
				) {
					addToast({
						title: "Invalid Sign In Method",
						color: "warning",
						timeout: 30_000,
						endContent: (
							<div className="w-full text-warning-400 text-sm">
								You've previously signed in with Google. Please authenticate
								with Google or{" "}
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
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
						{...register("password")}
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
					isLoading={isSubmitting || isPasswordLoginMutationInFlight}
					type="submit"
				>
					Authenticate with password
				</Button>
			</div>
		</form>
	);
}
