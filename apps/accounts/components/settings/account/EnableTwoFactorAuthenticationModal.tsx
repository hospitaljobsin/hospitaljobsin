import {
	Button,
	Code,
	Divider,
	InputOtp,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod";
import type { EnableTwoFactorAuthenticationModalMutation } from "./__generated__/EnableTwoFactorAuthenticationModalMutation.graphql";

const EnableTwoFactorAuthenticationMutation = graphql`
  mutation EnableTwoFactorAuthenticationModalMutation($token: String!) {
	setAccount2fa(token: $token) {
		__typename
		... on Account {
			id
		}
		... on InvalidCredentialsError {
			message
		}
		... on TwoFactorAuthenticationChallengeNotFoundError {
			message
		}
	}
  }
`;

const formSchema = z.object({
	token: z.string().length(6, "Token must be 6 characters long"),
});

export default function EnableTwoFactorAuthenticationModal({
	isOpen,
	onOpenChange,
	otpUri,
	onClose,
	secret,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	otpUri: string;
	secret: string;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<EnableTwoFactorAuthenticationModalMutation>(
			EnableTwoFactorAuthenticationMutation,
		);

	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			token: "",
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				token: formData.token,
			},
		});
	}
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="lg"
			className="p-4 sm:p-6"
		>
			<ModalContent className="flex flex-col w-full gap-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-medium">
						Enable Two Factor Authentication
					</h2>
					<p className="text-foreground-400 text-small font-normal">
						2FA adds an extra layer of security to your account. It's
						recommended to enable it after you've set up your password.
					</p>
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
					<ModalBody className="w-full flex flex-col gap-6 items-center justify-center">
						<QRCode
							size={128}
							className="max-w-64 min-w-48 h-auto"
							value={otpUri}
							viewBox="0 0 256 256"
						/>
						<p className="text-small text-foreground-500">
							If you can't scan the QR code, copy the secret below:
						</p>
						<Code>{secret}</Code>

						<Divider />
						<Controller
							control={control}
							name="token"
							render={({ field }) => (
								<InputOtp
									{...field}
									errorMessage={errors.token?.message}
									isInvalid={!!errors.token}
									length={6}
									description="Enter the 6-digit code from your 2FA app"
									classNames={{
										description: "text-small font-normal text-foreground-500",
										wrapper: "flex flex-col justify-center items-center",
									}}
								/>
							)}
						/>
					</ModalBody>
					<ModalFooter className="w-full">
						<Button color="danger" variant="light" onPress={onClose} fullWidth>
							Cancel
						</Button>
						<Button
							color="primary"
							type="submit"
							isLoading={isMutationInFlight || isSubmitting}
							fullWidth
						>
							Enable 2FA
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
