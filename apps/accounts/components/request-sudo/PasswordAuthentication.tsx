"use client";

import type { PasswordAuthenticationMutation as PasswordAuthenticationMutationType } from "@/__generated__/PasswordAuthenticationMutation.graphql";
import links from "@/lib/links";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod/v4-mini";
import { useTurnstile } from "../TurnstileProvider";

const PasswordAuthenticationMutation = graphql`
  mutation PasswordAuthenticationMutation($password: String!, $captchaToken: String!) {
    requestSudoModeWithPassword(password: $password, captchaToken: $captchaToken) {
      __typename
	  ... on Account {
		__typename
	  }
      ... on InvalidCredentialsError {
        message
      }
	  ... on InvalidCaptchaTokenError {
		message
	  }

	  ... on InvalidAuthenticationProviderError {
		message
	  }
    }
  }
`;

const passwordAuthenticationSchema = z.object({
	password: z.string().check(z.minLength(1, "This field is required")),
});

export default function PasswordAuthentication({
	isDisabled,
	onAuthStart,
	onAuthEnd,
}: {
	isDisabled: boolean;
	onAuthStart: () => void;
	onAuthEnd: () => void;
}) {
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
		resolver: standardSchemaResolver(passwordAuthenticationSchema),
	});

	const { executeCaptcha } = useTurnstile();

	async function onSubmit(
		values: z.infer<typeof passwordAuthenticationSchema>,
	) {
		onAuthStart();
		if (!executeCaptcha) {
			console.log("Recaptcha not loaded");
			onAuthEnd();
			return;
		}
		const token = await executeCaptcha("login_password");
		commitPasswordLoginMutation({
			variables: {
				password: values.password,
				captchaToken: token,
			},
			onCompleted(response) {
				if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidCredentialsError"
				) {
					setError("password", {
						message: response.requestSudoModeWithPassword.message,
					});
					onAuthEnd();
				} else if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
					onAuthEnd();
				} else if (
					response.requestSudoModeWithPassword.__typename ===
					"InvalidAuthenticationProviderError"
				) {
					// race condition: user removed their password inbetween
					// the time they submitted the sudo mode request and submitted it
					alert("Invalid sign-in method. Please try again.");
					onAuthEnd();
				} else {
					window.location.href = redirectTo;
				}
			},
			onError(error) {
				onAuthEnd();
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
							className="mt-2 cursor-pointer text-primary-600"
						>
							Forgot password?
						</Link>
					</div>
				</div>
				<Button
					fullWidth
					isDisabled={isDisabled}
					isLoading={isSubmitting || isPasswordLoginMutationInFlight}
					type="submit"
					size="lg"
				>
					Authenticate with password
				</Button>
			</div>
		</form>
	);
}
