"use client";

import type { PasswordRegistrationMutation as PasswordRegistrationMutationType } from "@/__generated__/PasswordRegistrationMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";
import { getValidRedirectURL } from "@/lib/redirects";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import SignupContext from "../SignupContext";

const passwordRegistrationSchema = z
	.object({
		password: z.string().check(
			z.minLength(1, "This field is required"),
			z.minLength(8, "Password must be at least 8 characters long."),
			z.refine((password) => /[a-z]/.test(password), {
				message: "Password must contain at least one lowercase letter.",
			}),
			z.refine((password) => /[A-Z]/.test(password), {
				message: "Password must contain at least one uppercase letter.",
			}),
			z.refine((password) => /\d/.test(password), {
				message: "Password must contain at least one number.",
			}),
			z.refine((password) => /[!@#$%^&*()\-_=+]/.test(password), {
				message:
					"Password must contain at least one special character (!@#$%^&*()-_=+).",
			}),
		),
		confirmPassword: z.string().check(z.minLength(1, "This field is required")),
	})
	.check(
		z.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ["confirmPassword"],
		}),
	);

const RegisterWithPasswordMutation = graphql`
  mutation PasswordRegistrationMutation(
    $email: String!
    $emailVerificationToken: String!
    $password: String!
    $fullName: String!
    $captchaToken: String!
  ) {
    registerWithPassword(
      email: $email
      emailVerificationToken: $emailVerificationToken
      password: $password
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
      ... on PasswordNotStrongError {
        message
	    }
		... on Account {
			id
			email
		}
    }
  }
`;

export default function PasswordRegistration() {
	const params = useSearchParams();
	const redirectTo = getValidRedirectURL(params.get("return_to"));
	const { send } = SignupContext.useActorRef();
	const emailVerificationToken = SignupContext.useSelector(
		(state) => state.context.emailVerificationToken,
	);
	const email = SignupContext.useSelector((state) => state.context.email);
	const fullName = SignupContext.useSelector((state) => state.context.fullName);
	const { executeCaptcha } = useTurnstile();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<z.infer<typeof passwordRegistrationSchema>>({
		resolver: standardSchemaResolver(passwordRegistrationSchema),
		defaultValues: { password: "" },
	});

	const [commitRegisterWithPassword] =
		useMutation<PasswordRegistrationMutationType>(RegisterWithPasswordMutation);

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	const onSubmit = async (data: z.infer<typeof passwordRegistrationSchema>) => {
		if (!executeCaptcha) return;

		const token = await executeCaptcha("register");
		commitRegisterWithPassword({
			variables: {
				email,
				emailVerificationToken,
				fullName,
				password: data.password,
				captchaToken: token,
			},
			onCompleted(response) {
				if (response.registerWithPassword.__typename === "EmailInUseError") {
					// we've hit the race condition failsafe.
					// show an unexpected error message and reset the form
					send({
						type: "SET_EMAIL_ERROR",
						message: response.registerWithPassword.message,
					});
				} else if (
					response.registerWithPassword.__typename ===
					"InvalidEmailVerificationTokenError"
				) {
					send({
						type: "SET_VERIFICATION_TOKEN_ERROR",
						message: response.registerWithPassword.message,
					});
				} else if (
					response.registerWithPassword.__typename === "PasswordNotStrongError"
				) {
					setError("password", {
						message: response.registerWithPassword.message,
					});
				} else if (
					response.registerWithPassword.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (response.registerWithPassword.__typename === "Account") {
					posthog.identify(response.registerWithPassword.id, {
						email: response.registerWithPassword.email,
					});
					// redirect to redirect URL
					window.location.href = redirectTo;
				}
			},
			updater(store) {
				store.invalidateStore();
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<Input
					label="Password"
					placeholder="Enter password"
					{...register("password")}
					autoComplete="new-password"
					type={isPasswordVisible ? "text" : "password"}
					endContent={
						<button
							type="button"
							onClick={() => setIsPasswordVisible(!isPasswordVisible)}
							className="focus:outline-none"
						>
							{isPasswordVisible ? (
								<EyeIcon className="text-2xl text-default-400" />
							) : (
								<EyeOffIcon className="text-2xl text-default-400" />
							)}
						</button>
					}
					errorMessage={errors.password?.message}
					isInvalid={!!errors.password}
				/>
				<Input
					label="Confirm Password"
					placeholder="Confirm password"
					{...register("confirmPassword")}
					autoComplete="new-password"
					type={isConfirmPasswordVisible ? "text" : "password"}
					endContent={
						<button
							type="button"
							onClick={() =>
								setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
							}
							className="focus:outline-none"
						>
							{isConfirmPasswordVisible ? (
								<EyeIcon className="text-2xl text-default-400" />
							) : (
								<EyeOffIcon className="text-2xl text-default-400" />
							)}
						</button>
					}
					errorMessage={errors.confirmPassword?.message}
					isInvalid={!!errors.confirmPassword}
				/>
				<Button fullWidth type="submit" isLoading={isSubmitting}>
					Create account
				</Button>
			</div>
		</form>
	);
}
