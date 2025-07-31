import type { VerificationTokenStepRequestPhoneNumberVerificationTokenMutation } from "@/__generated__/VerificationTokenStepRequestPhoneNumberVerificationTokenMutation.graphql";
import type { VerificationTokenStepUpdateAccountPhoneNumberMutation } from "@/__generated__/VerificationTokenStepUpdateAccountPhoneNumberMutation.graphql";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4";

const UpdateAccountPhoneNumberMutation = graphql`
  mutation VerificationTokenStepUpdateAccountPhoneNumberMutation($phoneNumber: String!, $phoneNumberVerificationToken: String!) {
    updateAccountPhoneNumber(phoneNumber: $phoneNumber, phoneNumberVerificationToken: $phoneNumberVerificationToken) {
      __typename
      ... on Account {
        __typename
        id
        phoneNumber
      }
      ... on InvalidPhoneNumberVerificationTokenError {
        message
      }
      ... on InvalidPhoneNumberError {
        message
      }
    }
  }
`;

const RequestPhoneNumberVerificationTokenMutation = graphql`
  mutation VerificationTokenStepRequestPhoneNumberVerificationTokenMutation($phoneNumber: String!) {
    requestPhoneNumberVerificationToken(phoneNumber: $phoneNumber) {
      __typename
      ... on RequestPhoneNumberVerificationTokenSuccess {
        cooldownRemainingSeconds
      }
      ... on InvalidPhoneNumberError {
        message
      }
      ... on PhoneNumberAlreadyExistsError {
        message
      }
      ... on PhoneNumberVerificationTokenCooldownError {
        message
        remainingSeconds
      }
    }
  }
`;

const formSchema = z.object({
	verificationToken: z
		.string()
		.min(1, "Verification code is required")
		.regex(/^\d{6}$/, "Please enter a valid 6-digit verification code")
		.length(6, "Verification code must be exactly 6 digits"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
	onSubmit: (data: FormData) => void;
	isSubmitting: boolean;
	onError: (error: string) => void;
	phoneNumber: string;
	onCancel: () => void;
	cooldownRemainingSeconds: number;
};

export default function VerificationTokenStep({
	onSubmit,
	isSubmitting,
	onError,
	phoneNumber,
	onCancel,
	cooldownRemainingSeconds: initialCooldownSeconds,
}: Props) {
	const [cooldownSeconds, setCooldownSeconds] = useState(
		initialCooldownSeconds,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<VerificationTokenStepUpdateAccountPhoneNumberMutation>(
			UpdateAccountPhoneNumberMutation,
		);
	const [commitResendMutation, isResendMutationInFlight] =
		useMutation<VerificationTokenStepRequestPhoneNumberVerificationTokenMutation>(
			RequestPhoneNumberVerificationTokenMutation,
		);

	const {
		handleSubmit,
		control,
		formState: { errors, isValid },
	} = useForm<FormData>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			verificationToken: "",
		},
	});

	// Timer effect for cooldown
	useEffect(() => {
		if (cooldownSeconds <= 0) return;

		const timer = setInterval(() => {
			setCooldownSeconds((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownSeconds]);

	function formatResendCooldown(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	}

	function handleResendVerification() {
		commitResendMutation({
			variables: {
				phoneNumber: `+91${phoneNumber}`,
			},
			onCompleted: (response, errors) => {
				if (errors) {
					onError("An unexpected error occurred. Please try again.");
					return;
				}

				const result = response.requestPhoneNumberVerificationToken;
				if (
					result.__typename === "RequestPhoneNumberVerificationTokenSuccess"
				) {
					setCooldownSeconds(result.cooldownRemainingSeconds);
				} else if (result.__typename === "InvalidPhoneNumberError") {
					onError(result.message);
				} else if (result.__typename === "PhoneNumberAlreadyExistsError") {
					onError(result.message);
				} else if (
					result.__typename === "PhoneNumberVerificationTokenCooldownError"
				) {
					setCooldownSeconds(result.remainingSeconds);
					onError(
						`${result.message} Please wait ${result.remainingSeconds} seconds before trying again.`,
					);
				}
			},
			onError: (error) => {
				onError("Failed to send verification code. Please try again.");
			},
		});
	}

	function handleFormSubmit(data: FormData) {
		commitMutation({
			variables: {
				phoneNumber: `+91${phoneNumber}`,
				phoneNumberVerificationToken: data.verificationToken,
			},
			onCompleted: (response, errors) => {
				if (errors) {
					onError("An unexpected error occurred. Please try again.");
					return;
				}

				const result = response.updateAccountPhoneNumber;
				if (result.__typename === "Account") {
					onSubmit(data);
				} else if (
					result.__typename === "InvalidPhoneNumberVerificationTokenError"
				) {
					onError(result.message);
				} else if (result.__typename === "InvalidPhoneNumberError") {
					onError(result.message);
				}
			},
			onError: (error) => {
				onError("Failed to verify phone number. Please try again.");
			},
		});
	}

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className="flex flex-col gap-4"
		>
			<div className="flex items-center justify-between gap-6">
				<Controller
					name="verificationToken"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							type="text"
							label="Verification Code"
							description="Enter the 6-digit code sent to your WhatsApp number"
							errorMessage={errors.verificationToken?.message}
							isInvalid={!!errors.verificationToken}
							isDisabled={isSubmitting || isMutationInFlight}
							maxLength={6}
							className="w-full"
						/>
					)}
				/>
				<div className="flex justify-center">
					{cooldownSeconds > 0 ? (
						<div className="flex flex-col gap-1 text-foreground-500">
							<span className="text-tiny whitespace-nowrap">Resend in</span>
							<p className="text-md font-medium">
								{formatResendCooldown(cooldownSeconds)}
							</p>
						</div>
					) : (
						<Button
							size="sm"
							variant="faded"
							onPress={handleResendVerification}
							isDisabled={isResendMutationInFlight}
						>
							Resend Code
						</Button>
					)}
				</div>
			</div>
			<div className="flex gap-4 items-center w-full flex-row">
				<Button
					variant="flat"
					type="button"
					fullWidth
					isDisabled={isSubmitting || isMutationInFlight}
					onPress={onCancel}
				>
					Cancel
				</Button>
				<Button
					color="primary"
					fullWidth
					type="submit"
					isDisabled={!isValid || isSubmitting || isMutationInFlight}
					isLoading={isSubmitting || isMutationInFlight}
				>
					Verify & Update
				</Button>
			</div>
		</form>
	);
}
