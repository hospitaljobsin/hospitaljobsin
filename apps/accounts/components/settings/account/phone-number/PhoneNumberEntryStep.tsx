import type { PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation } from "@/__generated__/PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation.graphql";
import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4";

const RequestPhoneNumberVerificationTokenMutation = graphql`
  mutation PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation($phoneNumber: String!) {
    requestPhoneNumberVerificationToken(phoneNumber: $phoneNumber) {
      __typename
      ... on RequestPhoneNumberVerificationTokenSuccess {
        __typename
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
	phoneNumber: z.string().min(1, "Phone number is required").length(10),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
	onSubmit: (data: FormData) => void;
	isSubmitting: boolean;
};

export default function PhoneNumberEntryStep({
	onSubmit,
	isSubmitting,
}: Props) {
	const [commitMutation, isMutationInFlight] =
		useMutation<PhoneNumberEntryStepRequestPhoneNumberVerificationTokenMutation>(
			RequestPhoneNumberVerificationTokenMutation,
		);

	const {
		handleSubmit,
		control,
		formState: { errors, isValid },
		setError,
	} = useForm<FormData>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			phoneNumber: "",
		},
	});

	function handleFormSubmit(data: FormData) {
		commitMutation({
			variables: {
				phoneNumber: data.phoneNumber,
			},
			onCompleted: (response, errors) => {
				if (errors) {
					setError("phoneNumber", {
						type: "manual",
						message: "An unexpected error occurred. Please try again.",
					});
					return;
				}

				const result = response.requestPhoneNumberVerificationToken;
				if (
					result.__typename === "RequestPhoneNumberVerificationTokenSuccess"
				) {
					onSubmit(data);
				} else if (result.__typename === "InvalidPhoneNumberError") {
					setError("phoneNumber", {
						type: "manual",
						message: result.message,
					});
				} else if (result.__typename === "PhoneNumberAlreadyExistsError") {
					setError("phoneNumber", {
						type: "manual",
						message: result.message,
					});
				} else if (
					result.__typename === "PhoneNumberVerificationTokenCooldownError"
				) {
					setError("phoneNumber", {
						type: "manual",
						message: `${result.message} Please wait ${result.remainingSeconds} seconds before trying again.`,
					});
				}
			},
			onError: (error) => {
				setError("phoneNumber", {
					type: "manual",
					message: "Failed to send verification code. Please try again.",
				});
			},
		});
	}

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className="flex flex-col gap-4"
		>
			<Controller
				name="phoneNumber"
				control={control}
				render={({ field }) => (
					<Input
						{...field}
						type="tel"
						label="WhatsApp Phone Number"
						startContent={<p className="text-sm">+91 </p>}
						placeholder="98765 43210"
						description="Enter your WhatsApp phone number to receive a verification code"
						errorMessage={errors.phoneNumber?.message}
						isInvalid={!!errors.phoneNumber}
						isDisabled={isSubmitting || isMutationInFlight}
						className="w-full"
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
					Send Code
				</Button>
			</div>
		</form>
	);
}
