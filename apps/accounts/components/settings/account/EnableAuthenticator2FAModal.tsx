import type { EnableAuthenticator2FAModalMutation } from "@/__generated__/EnableAuthenticator2FAModalMutation.graphql";
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
	Tooltip,
	addToast,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Clipboard } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4";
import SaveRecoveryCodesModal from "./SaveRecoveryCodesModal";

const EnableAuthenticator2FAMutation = graphql`
  mutation EnableAuthenticator2FAModalMutation($token: String!) {
	enableAccount2faWithAuthenticator(token: $token) {
		__typename
		... on EnableAccount2FAWithAuthenticatorSuccess {
			account {
				id
				...TwoFactorAuthenticationFragment
			}
			recoveryCodes
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

export default function EnableAuthenticator2FAModal({
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
	const [recoveryCodes, setRecoveryCodes] = useState<readonly string[] | null>(
		null,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<EnableAuthenticator2FAModalMutation>(
			EnableAuthenticator2FAMutation,
		);

	const {
		handleSubmit,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			token: "",
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				token: formData.token,
			},
			onCompleted(response) {
				if (
					response.enableAccount2faWithAuthenticator.__typename ===
					"TwoFactorAuthenticationChallengeNotFoundError"
				) {
					addToast({
						title: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
					onClose();
				} else if (
					response.enableAccount2faWithAuthenticator.__typename ===
					"InvalidCredentialsError"
				) {
					setError("token", {
						message: response.enableAccount2faWithAuthenticator.message,
					});
				} else if (
					response.enableAccount2faWithAuthenticator.__typename ===
					"EnableAccount2FAWithAuthenticatorSuccess"
				) {
					setRecoveryCodes(
						response.enableAccount2faWithAuthenticator.recoveryCodes,
					);
				}
			},
		});
	}

	if (recoveryCodes) {
		return (
			<SaveRecoveryCodesModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				recoveryCodes={recoveryCodes}
				onClose={() => {
					setRecoveryCodes(null);
					onClose();
				}}
			/>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
			className="overflow-y-auto"
		>
			<ModalContent className="flex flex-col w-full gap-6 p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-medium">
						Enable Two Factor Authentication
					</h2>
					<p className="text-foreground-400 text-small font-normal w-full">
						2FA adds an extra layer of security to your account. It's
						recommended to enable it alongside password/ Oauth2 authentication.
					</p>
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
					<ModalBody className="w-full flex flex-col gap-6 items-start">
						<QRCode
							size={128}
							className="sm:max-w-96 sm:min-w-64 max-w-64 min-w-48 h-auto"
							value={otpUri}
							viewBox="0 0 256 256"
						/>
						<div className="w-full flex flex-col gap-4">
							<p className="text-small text-foreground-500">
								If you can't scan the QR code, copy the secret below:
							</p>
							<div className="flex items-center gap-2">
								<Code className="overflow-x-auto">{secret}</Code>
								<Tooltip content="Copy secret to clipboard">
									<Button
										isIconOnly
										variant="bordered"
										size="sm"
										onPress={() => navigator.clipboard.writeText(secret)}
										aria-label="Copy secret to clipboard"
									>
										<Clipboard size={16} />
									</Button>
								</Tooltip>
							</div>
						</div>

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
									size="lg"
									description="Enter the 6-digit code from your 2FA app"
									classNames={{
										errorMessage: "text-small font-normal text-danger",
										description: "text-small font-normal text-foreground-500",
										wrapper: "flex flex-col justify-center items-center",
									}}
								/>
							)}
						/>
					</ModalBody>
					<ModalFooter className="w-full pt-0">
						<Button color="danger" variant="light" onPress={onClose} fullWidth>
							Cancel
						</Button>
						<Button
							color="primary"
							type="submit"
							isLoading={isMutationInFlight || isSubmitting}
							fullWidth
						>
							Enable
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
