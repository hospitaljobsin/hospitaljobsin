import type { PasskeysControllerFragment$key } from "@/__generated__/PasskeysControllerFragment.graphql";
import type { PasskeysControllerGenerateOptionsMutation } from "@/__generated__/PasskeysControllerGenerateOptionsMutation.graphql";
import type { PasskeysControllerMutation } from "@/__generated__/PasskeysControllerMutation.graphql";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    addToast,
    useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { startRegistration } from "@simplewebauthn/browser";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4";

const PasskeysControllerFragment = graphql`
  fragment PasskeysControllerFragment on Account {
   	sudoModeExpiresAt
  }
`;

const GeneratePasskeyCreationOptionsMutation = graphql`
    mutation PasskeysControllerGenerateOptionsMutation {
        generateWebAuthnCredentialCreationOptions {
            ... on GeneratePasskeyCreationOptionsSuccess {
                registrationOptions
            }
    }
}
`;

const CreatePasskeyMutation = graphql`
    mutation PasskeysControllerMutation($nickname: String!, $passkeyRegistrationResponse: JSON!, $connections: [ID!]!) {
        createWebAuthnCredential(nickname: $nickname, passkeyRegistrationResponse: $passkeyRegistrationResponse) {
            __typename
            ... on InvalidPasskeyRegistrationCredentialError {
                message
            }

            ... on CreateWebAuthnCredentialSuccess {
                webAuthnCredentialEdge @prependEdge(connections: $connections) {
                    cursor
                    node {
                        id
                        ...PasskeyFragment
                    }
                }
            }
        }
}
`;

type Props = {
	passkeysConnectionId: string;
	account: PasskeysControllerFragment$key;
};

const createPasskeySchema = z.object({
	nickname: z
		.string()
		.min(1, "This Field is required")
		.max(75, "Nickname cannot exceed 75 characters"),
});

export default function PasskeysController({
	passkeysConnectionId,
	account,
}: Props) {
	const { checkSudoMode } = useCheckSudoMode();
	const data = useFragment(PasskeysControllerFragment, account);
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [commitCreateMutation, isCreateMutationInFlight] =
		useMutation<PasskeysControllerMutation>(CreatePasskeyMutation);
	const [commitGenerateOptionsMutation, isGenerateOptionsMutationInFlight] =
		useMutation<PasskeysControllerGenerateOptionsMutation>(
			GeneratePasskeyCreationOptionsMutation,
		);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof createPasskeySchema>>({
		resolver: zodResolver(createPasskeySchema),
		defaultValues: {
			nickname: "My Passkey",
		},
	});

	function handleModalOpen() {
		if (checkSudoMode(data.sudoModeExpiresAt)) {
			onOpen();
		}
	}

	async function onSubmit(values: z.infer<typeof createPasskeySchema>) {
		commitGenerateOptionsMutation({
			variables: {},
			onCompleted(response) {
				startRegistration({
					optionsJSON: JSON.parse(
						response.generateWebAuthnCredentialCreationOptions
							.registrationOptions,
					),
				})
					.then((registrationResponse) => {
						commitCreateMutation({
							variables: {
								connections: [passkeysConnectionId],
								nickname: values.nickname,
								passkeyRegistrationResponse:
									JSON.stringify(registrationResponse),
							},
							onCompleted(response) {
								if (
									response.createWebAuthnCredential.__typename ===
									"InvalidPasskeyRegistrationCredentialError"
								) {
									addToast({
										title: "Passkey creation failed!",
										color: "danger",
									});
								} else if (
									response.createWebAuthnCredential.__typename ===
									"CreateWebAuthnCredentialSuccess"
								) {
									onClose();
								}
							},
						});
					})
					.catch((error) => {
						addToast({
							title: "Passkey creation failed!",
							color: "danger",
						});
					});
			},
		});
	}

	return (
		<>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="flat"
				onPress={handleModalOpen}
				spinnerPlacement="end"
				className="hidden md:flex"
			>
				Create Passkey
			</Button>
			<Button
				startContent={<PlusIcon size={16} />}
				variant="flat"
				onPress={handleModalOpen}
				spinnerPlacement="end"
				size="sm"
				className="flex md:hidden"
			>
				Create Passkey
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						Create Passkey
					</ModalHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
						<ModalBody>
							<Input
								id="nickname"
								label="Nickname"
								placeholder="My Screen Lock"
								{...register("nickname")}
								description="Nicknames help identify your passkeys"
								errorMessage={errors.nickname?.message}
								isInvalid={!!errors.nickname}
							/>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Cancel
							</Button>
							<Button
								color="primary"
								type="submit"
								isLoading={
									isSubmitting ||
									isCreateMutationInFlight ||
									isGenerateOptionsMutationInFlight
								}
							>
								Create Passkey
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
