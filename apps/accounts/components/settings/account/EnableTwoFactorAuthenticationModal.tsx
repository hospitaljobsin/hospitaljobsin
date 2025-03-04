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
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clipboard } from "lucide-react";
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
			...TwoFactorAuthenticationFragment
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
		setError,
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
			onCompleted(response) {
				if (
					response.setAccount2fa.__typename === "Account" ||
					response.setAccount2fa.__typename ===
						"TwoFactorAuthenticationChallengeNotFoundError"
				) {
					onClose();
				} else if (
					response.setAccount2fa.__typename === "InvalidCredentialsError"
				) {
					setError("token", { message: response.setAccount2fa.message });
				}
			},
		});
	}
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
		>
			<ModalContent className="flex flex-col w-full gap-6 p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					<h2 className="text-lg font-medium">
						Enable Two Factor Authentication
					</h2>
					<p className="text-foreground-400 text-small font-normal w-full">
						2FA adds an extra layer of security to your account. It's
						recommended to enable it alongside password authentication.
					</p>
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
					<ModalBody className="w-full flex flex-col gap-8 items-start">
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
