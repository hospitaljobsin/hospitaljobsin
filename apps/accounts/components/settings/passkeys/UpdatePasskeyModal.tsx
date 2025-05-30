import {
	addToast,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import type { UpdatePasskeyModalFragment$key } from "@/__generated__/UpdatePasskeyModalFragment.graphql";
import type { UpdatePasskeyModalMutation } from "@/__generated__/UpdatePasskeyModalMutation.graphql";

export const UpdatePasskeyModalFragment = graphql`
  fragment UpdatePasskeyModalFragment on WebAuthnCredential {
	id
	nickname
  }
`;

const UpdatePasskeyMutation = graphql`
  mutation UpdatePasskeyModalMutation($webAuthnCredentialId: ID!, $nickname: String!) {
    updateWebAuthnCredential(webAuthnCredentialId: $webAuthnCredentialId, nickname: $nickname) {
		__typename
        ... on WebAuthnCredential {
            id
			nickname
        }

		... on WebAuthnCredentialNotFoundError {
			message
		}
    }
  }
`;

type Props = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	passkey: UpdatePasskeyModalFragment$key;
};

const updatePasskeySchema = z.object({
	nickname: z
		.string()
		.check(
			z.minLength(1, "This field is required"),
			z.maxLength(75, "Nickname cannot exceed 75 characters"),
		),
});

export default function UpdatePasskeyModal({
	isOpen,
	onOpenChange,
	onClose,
	passkey,
}: Props) {
	const data = useFragment(UpdatePasskeyModalFragment, passkey);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<z.infer<typeof updatePasskeySchema>>({
		resolver: standardSchemaResolver(updatePasskeySchema),
		defaultValues: {
			nickname: data.nickname,
		},
	});

	const [commitMutation, isMutationInFlight] =
		useMutation<UpdatePasskeyModalMutation>(UpdatePasskeyMutation);

	async function onSubmit(values: z.infer<typeof updatePasskeySchema>) {
		commitMutation({
			variables: {
				webAuthnCredentialId: data.id,
				nickname: values.nickname,
			},
			onCompleted: (response) => {
				if (
					response.updateWebAuthnCredential.__typename ===
					"WebAuthnCredentialNotFoundError"
				) {
					addToast({
						title: "Passkey not found!",
						color: "danger",
					});
				}
				onClose();
			},
		});
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Update Passkey
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
						<Button color="danger" variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="default"
							type="submit"
							isLoading={isSubmitting || isMutationInFlight}
							isDisabled={!isDirty}
						>
							Update Passkey
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
