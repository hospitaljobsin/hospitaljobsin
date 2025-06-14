import type { InviteMemberModalFragment$key } from "@/__generated__/InviteMemberModalFragment.graphql";
import type { InviteMemberModalMutation as InviteMemberModalMutationType } from "@/__generated__/InviteMemberModalMutation.graphql";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import {
	ConnectionHandler,
	graphql,
	useFragment,
	useMutation,
} from "react-relay";
import { z } from "zod/v4-mini";

type Props = {
	isOpen: boolean;
	onOpenChange: (arg: boolean) => void;
	onClose: () => void;
	organization: InviteMemberModalFragment$key;
};

const inviteMemberSchema = z.object({
	email: z
		.string()
		.check(
			z.minLength(1, "This field is required"),
			z.email("Invalid email address"),
		),
});

const InviteMemberModalMutation = graphql`
  mutation InviteMemberModalMutation($organizationId: ID!, $email: String!) {
    createOrganizationInvite(organizationId: $organizationId, email: $email) {
      __typename
      ... on OrganizationInvite {
        id
        ...InviteFragment
      }
	  ... on InvalidEmailError {
		__typename
		message
	  }
      ... on OrganizationNotFoundError {
        __typename
      }
      ... on MemberAlreadyExistsError {
        __typename
        message
      }

	  ... on OrganizationAuthorizationError {
		__typename
	  }
    }
  }
`;

const InviteMemberModalFragment = graphql`
fragment InviteMemberModalFragment on Organization {
    id
}`;

export default function InviteMemberModal({
	isOpen,
	onOpenChange,
	onClose,
	organization,
}: Props) {
	const data = useFragment(InviteMemberModalFragment, organization);
	const [commitMutation, isMutationInFlight] =
		useMutation<InviteMemberModalMutationType>(InviteMemberModalMutation);

	const { register, handleSubmit, formState, setError } = useForm({
		resolver: standardSchemaResolver(inviteMemberSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(values: z.infer<typeof inviteMemberSchema>) {
		commitMutation({
			variables: { email: values.email, organizationId: data.id },
			updater: (store, responseData) => {
				if (
					responseData &&
					responseData.createOrganizationInvite.__typename ===
						"OrganizationInvite"
				) {
					// Retrieve the connection from the store
					const organizationRecord = store.get(data.id);
					if (!organizationRecord) return;
					const connectionRecord = ConnectionHandler.getConnection(
						organizationRecord,
						"OrganizationInvitesListInternalFragment_invites",
					);

					const inviteRecord = store.get(
						responseData.createOrganizationInvite.id,
					);

					// Only update if the connection exists
					if (connectionRecord && inviteRecord) {
						const newEdge = ConnectionHandler.createEdge(
							store,
							connectionRecord,
							inviteRecord,
							"OrganizationInviteEdge",
						);
						ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
					}
				}
			},
			onCompleted(response) {
				if (
					response.createOrganizationInvite.__typename === "OrganizationInvite"
				) {
					onOpenChange(false);
				} else if (
					response.createOrganizationInvite.__typename === "InvalidEmailError"
				) {
					setError("email", {
						type: "server",
						message: response.createOrganizationInvite.message,
					});
				} else if (
					response.createOrganizationInvite.__typename ===
					"MemberAlreadyExistsError"
				) {
					setError("email", {
						type: "server",
						message: response.createOrganizationInvite.message,
					});
				} else if (
					response.createOrganizationInvite.__typename ===
					"OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.createOrganizationInvite.__typename ===
					"OrganizationAuthorizationError"
				) {
					addToast({
						description: "You are not authorized to perform this action.",
						color: "danger",
					});
				}
			},
		});
	}

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="center"
			hideCloseButton
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Invite New Member
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<ModalBody>
						<div className="w-full flex flex-col gap-6">
							<Input
								{...register("email")}
								label="Email Address"
								placeholder="Enter new member's email address"
								type="text"
								errorMessage={formState.errors.email?.message}
								isInvalid={!!formState.errors.email}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Close
						</Button>
						<Button
							color="primary"
							type="submit"
							isDisabled={isMutationInFlight}
						>
							Invite Member
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
