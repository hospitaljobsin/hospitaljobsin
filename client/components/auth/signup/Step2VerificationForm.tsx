"use client";

import { timeFormat } from "@/lib/intl";
import { Button, Input, Tooltip } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3Icon } from "lucide-react";
import { useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";
import SignupContext from "./SignupContext";
import type { Step2VerificationFormMutation as Step2VerificationFormMutationType } from "./__generated__/Step2VerificationFormMutation.graphql";
import type { Step2VerificationFormRequestVerificationMutation as Step2VerificationFormRequestVerificationMutationType } from "./__generated__/Step2VerificationFormRequestVerificationMutation.graphql";

const step2Schema = z.object({
	emailVerificationToken: z.string().min(1),
});

const VerifyEmailMutation = graphql`
  mutation Step2VerificationFormMutation(
    $email: String!
    $emailVerificationToken: String!
    $recaptchaToken: String!
  ) {
    verifyEmail(
      email: $email
      emailVerificationToken: $emailVerificationToken
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
      ... on VerifyEmailSuccess {
        message
      }
    }
  }
`;

const RequestVerificationMutation = graphql`
  mutation Step2VerificationFormRequestVerificationMutation($email: String!, $recaptchaToken: String!) {
    requestEmailVerificationToken(email: $email, recaptchaToken: $recaptchaToken) {
      __typename
      ... on EmailInUseError {
        message
      }
      ... on InvalidEmailError {
        message
      }
      ... on InvalidRecaptchaTokenError {
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
	const { executeRecaptcha } = useGoogleReCaptcha();
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm({
		resolver: zodResolver(step2Schema),
		defaultValues: { emailVerificationToken: emailVerificationToken || "" },
	});

	useEffect(() => {
		// set email verifcation errors that may have arisen from other steps
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
		if (!executeRecaptcha) return;

		const token = await executeRecaptcha("email_verification_resend");
		commitResendVerification({
			variables: { email, recaptchaToken: token },
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
					"InvalidRecaptchaTokenError"
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
					// TODO: show toast here to check inbox
				}
			},
		});
	};

	const onSubmit = async (data: { emailVerificationToken: string }) => {
		if (!executeRecaptcha) return;

		const token = await executeRecaptcha("verify_email");
		commitVerifyEmail({
			variables: {
				email,
				emailVerificationToken: data.emailVerificationToken,
				recaptchaToken: token,
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
					response.verifyEmail.__typename === "InvalidRecaptchaTokenError"
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
