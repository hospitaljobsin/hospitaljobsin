import type { VerificationTokenStepUpdateAccountPhoneNumberMutation } from "@/__generated__/VerificationTokenStepUpdateAccountPhoneNumberMutation.graphql";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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
};

export default function VerificationTokenStep({
	onSubmit,
	isSubmitting,
	onError,
	phoneNumber,
}: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<VerificationTokenStepUpdateAccountPhoneNumberMutation>(
			UpdateAccountPhoneNumberMutation,
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

	function handleFormSubmit(data: FormData) {
		commitMutation({
			variables: {
				phoneNumber: phoneNumber,
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
			<Controller
				name="verificationToken"
				control={control}
				render={({ field }) => (
					<Input
						{...field}
						type="text"
						label="Verification Code"
						placeholder="123456"
						description="Enter the 6-digit code sent to your WhatsApp number"
						errorMessage={errors.verificationToken?.message}
						isInvalid={!!errors.verificationToken}
						isDisabled={isSubmitting || isMutationInFlight}
						maxLength={6}
						className="w-full"
						onKeyPress={(e) => {
							// Only allow numeric input
							if (!/[0-9]/.test(e.key)) {
								e.preventDefault();
							}
						}}
					/>
				)}
			/>
			<div className="flex gap-4 items-center w-full flex-row">
				<Button
					variant="flat"
					type="button"
					fullWidth
					isDisabled={isSubmitting || isMutationInFlight}
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
