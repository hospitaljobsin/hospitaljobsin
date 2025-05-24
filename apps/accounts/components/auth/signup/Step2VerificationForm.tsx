"use client";

import { addToast, Button, Input, Tooltip } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Edit3Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import type { Step2VerificationFormMutation as Step2VerificationFormMutationType } from "@/__generated__/Step2VerificationFormMutation.graphql";
import type { Step2VerificationFormRequestVerificationMutation as Step2VerificationFormRequestVerificationMutationType } from "@/__generated__/Step2VerificationFormRequestVerificationMutation.graphql";
import { useTurnstile } from "@/components/TurnstileProvider";
import { timeFormat } from "@/lib/intl";
import SignupContext from "./SignupContext";

const step2Schema = z.object({
	emailVerificationToken: z
		.string()
		.check(z.minLength(1, "This field is required")),
});

const VerifyEmailMutation = graphql`
  mutation Step2VerificationFormMutation(
    $email: String!
    $emailVerificationToken: String!
    $captchaToken: String!
  ) {
    verifyEmail(
      email: $email
      emailVerificationToken: $emailVerificationToken
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
      ... on VerifyEmailSuccess {
        message
      }
    }
  }
`;

const RequestVerificationMutation = graphql`
  mutation Step2VerificationFormRequestVerificationMutation($email: String!, $captchaToken: String!) {
    requestEmailVerificationToken(email: $email, captchaToken: $captchaToken) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidEmailError {
        message
      }
      ... on InvalidCaptchaTokenError {
        message
      }
      ... on EmailVerificationTokenCooldownError {
        message
        remainingSeconds
      }
      ... on RequestEmailVerificationSuccess {
        message
        remainingSeconds
      }
    }
  }
`;

export default function Step2VerificationForm() {
	const { send } = SignupContext.useActorRef();
	const emailVerificationToken = SignupContext.useSelector(
		(state) => state.context.emailVerificationToken,
	);
	const emailVerificationError = SignupContext.useSelector(
		(state) => state.context.emailVerificationError,
	);
	const email = SignupContext.useSelector((state) => state.context.email);
	const cooldownSeconds = SignupContext.useSelector(
		(state) => state.context.cooldownSeconds,
	);
	const { executeCaptcha } = useTurnstile();
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<z.infer<typeof step2Schema>>({
		resolver: standardSchemaResolver(step2Schema),
		defaultValues: { emailVerificationToken: emailVerificationToken || "" },
	});

	useEffect(() => {
		if (emailVerificationError) {
			setError("emailVerificationToken", {
				message: emailVerificationError,
			});
		}
	}, [emailVerificationError, setError]);

	useEffect(() => {
		if (cooldownSeconds <= 0) return;

		const timer = setInterval(() => {
			send({ type: "SET_RESEND_COOLDOWN", cooldown: cooldownSeconds - 1 });
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownSeconds, send]);

	const [commitVerifyEmail] =
		useMutation<Step2VerificationFormMutationType>(VerifyEmailMutation);
	const [commitResendVerification, isResendMutationInFlight] =
		useMutation<Step2VerificationFormRequestVerificationMutationType>(
			RequestVerificationMutation,
		);

	function formatResendCooldown(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes}:${timeFormat.format(remainingSeconds)}`;
	}

	const handleResendVerification = async () => {
		if (!executeCaptcha) return;

		const token = await executeCaptcha("email_verification_resend");
		commitResendVerification({
			variables: { email, captchaToken: token },
			onCompleted(response) {
				if (
					response.requestEmailVerificationToken.__typename ===
					"EmailVerificationTokenCooldownError"
				) {
					send({
						type: "SET_RESEND_COOLDOWN",
						cooldown: response.requestEmailVerificationToken.remainingSeconds,
					});
				} else if (
					response.requestEmailVerificationToken.__typename ===
						"EmailInUseError" ||
					response.requestEmailVerificationToken.__typename ===
						"InvalidEmailError"
				) {
					// we've hit the race condition failsafe.
					// show an unexpected error message and reset the form
					send({
						type: "SET_EMAIL_ERROR",
						message: response.requestEmailVerificationToken.message,
					});
				} else if (
					response.requestEmailVerificationToken.__typename ===
					"InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (
					response.requestEmailVerificationToken.__typename ===
					"RequestEmailVerificationSuccess"
				) {
					send({
						type: "SET_RESEND_COOLDOWN",
						cooldown: response.requestEmailVerificationToken.remainingSeconds,
					});
					// show toast here to check inbox
					addToast({
						title: "Email Verification Token Sent",
						description: "Please check your email inbox (maybe spam).",
						color: "success",
					});
				}
			},
		});
	};

	const onSubmit = async (data: z.infer<typeof step2Schema>) => {
		if (!executeCaptcha) return;

		const token = await executeCaptcha("verify_email");
		commitVerifyEmail({
			variables: {
				email,
				emailVerificationToken: data.emailVerificationToken,
				captchaToken: token,
			},
			onCompleted(response) {
				if (response.verifyEmail.__typename === "EmailInUseError") {
					// we've hit the race condition failsafe.
					// show an unexpected error message and reset the form
					send({
						type: "SET_EMAIL_ERROR",
						message: response.verifyEmail.message,
					});
				} else if (
					response.verifyEmail.__typename ===
					"InvalidEmailVerificationTokenError"
				) {
					setError("emailVerificationToken", {
						message: response.verifyEmail.message,
					});
				} else if (
					response.verifyEmail.__typename === "InvalidCaptchaTokenError"
				) {
					// handle recaptcha failure
					alert("Recaptcha failed. Please try again.");
				} else if (response.verifyEmail.__typename === "VerifyEmailSuccess") {
					send({
						type: "SUBMIT_VERIFICATION",
						token: data.emailVerificationToken,
					});
				}
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<Input
					label="Email Address"
					value={email}
					isReadOnly
					endContent={
						<Tooltip content="Incorrect email? Go back">
							<Button
								isIconOnly
								variant="light"
								onPress={() => send({ type: "EDIT_EMAIL" })}
								type="button"
							>
								<Edit3Icon className="text-foreground-400 mt-2" size={24} />
							</Button>
						</Tooltip>
					}
				/>
				<div className="w-full flex justify-start items-center gap-6">
					<Controller
						control={control}
						name="emailVerificationToken"
						render={({ field }) => (
							<Input
								label="Email Verification Token"
								description="Check your email inbox (maybe spam)."
								errorMessage={errors.emailVerificationToken?.message}
								isInvalid={!!errors.emailVerificationToken}
								{...field}
							/>
						)}
					/>
					{cooldownSeconds > 0 ? (
						<div className="flex flex-col gap-1 text-foreground-500 mb-4">
							<span className="text-tiny whitespace-nowrap">Resend in</span>
							<p className="text-md font-medium">
								{formatResendCooldown(cooldownSeconds)}
							</p>
						</div>
					) : (
						<Button
							size="md"
							variant="faded"
							onPress={handleResendVerification}
							className="mb-4"
							isDisabled={isResendMutationInFlight}
						>
							Resend
						</Button>
					)}
				</div>

				<Button fullWidth type="submit" isLoading={isSubmitting}>
					Continue
				</Button>
			</div>
		</form>
	);
}
