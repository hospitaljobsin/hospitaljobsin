import {
	Button,
	Code,
	Input,
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
	secret,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
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
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-4 w-full">
							<h2 className="text-lg font-medium">
								Enable Two Factor Authentication
							</h2>
						</ModalHeader>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-12 w-full"
						>
							<ModalBody className="w-full">
								<QRCode
									size={128}
									style={{ height: "auto", maxWidth: "100%", width: "100%" }}
									value={otpUri}
									viewBox="0 0 256 256"
								/>
								<p className="text-small text-foreground-500">
									If you can't scan the QR code, copy the secret below:
								</p>
								<Code>{secret}</Code>
								<Controller
									name="token"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<Input
											{...field}
											label="Token"
											value={field.value ?? ""}
											errorMessage={errors.token?.message}
											isInvalid={!!errors.token}
										/>
									)}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button
									color="primary"
									type="submit"
									isLoading={isMutationInFlight || isSubmitting}
								>
									Enable 2FA
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
