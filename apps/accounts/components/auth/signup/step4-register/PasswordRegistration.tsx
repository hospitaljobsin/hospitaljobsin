"use client";

import { getValidRedirectURL } from "@/lib/redirects";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";
import SignupContext from "../SignupContext";
import type { PasswordRegistrationMutation as PasswordRegistrationMutationType } from "./__generated__/PasswordRegistrationMutation.graphql";

const passwordRegistrationSchema = z.object({
	password: z
		.string()
		.min(1, "This field is required")
		.min(8, "Password must be at least 8 characters long.")
		.refine((password) => /[a-z]/.test(password), {
			message: "Password must contain at least one lowercase letter.",
		})
		.refine((password) => /[A-Z]/.test(password), {
			message: "Password must contain at least one uppercase letter.",
		})
		.refine((password) => /\d/.test(password), {
			message: "Password must contain at least one number.",
		})
		.refine((password) => /[!@#$%^&*()\-_=+]/.test(password), {
			message:
				"Password must contain at least one special character (!@#$%^&*()-_=+).",
		}),
});

const RegisterWithPasswordMutation = graphql`
  mutation PasswordRegistrationMutation(
    $email: String!
    $emailVerificationToken: String!
    $password: String!
    $fullName: String!
    $recaptchaToken: String!
  ) {
    registerWithPassword(
      email: $email
      emailVerificationToken: $emailVerificationToken
      password: $password
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
      ... on PasswordNotStrongError {
        message
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
	const { executeRecaptcha } = useGoogleReCaptcha();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm({
		resolver: zodResolver(passwordRegistrationSchema),
		defaultValues: { password: "", fullName: "" },
	});

	const [commitRegisterWithPassword] =
		useMutation<PasswordRegistrationMutationType>(RegisterWithPasswordMutation);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const onSubmit = async (data: { password: string; fullName: string }) => {
		if (!executeRecaptcha) return;

		const token = await executeRecaptcha("register");
		commitRegisterWithPassword({
			variables: {
				email,
				emailVerificationToken,
				fullName,
				password: data.password,
				recaptchaToken: token,
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
					"InvalidRecaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else {
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
				<Button fullWidth type="submit" isLoading={isSubmitting}>
					Create account
				</Button>
			</div>
		</form>
	);
}
