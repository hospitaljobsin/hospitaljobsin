import { useRouter } from "@bprogress/next/app";
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
import { ConnectionHandler, graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import type { DeleteOrganizationModalAccountFragment$key } from "@/__generated__/DeleteOrganizationModalAccountFragment.graphql";
import type { DeleteOrganizationModalFragment$key } from "@/__generated__/DeleteOrganizationModalFragment.graphql";
import type { DeleteOrganizationModalMutation } from "@/__generated__/DeleteOrganizationModalMutation.graphql";
import links from "@/lib/links";

const DeleteOrganizationModalFragment = graphql`
    fragment DeleteOrganizationModalFragment on Organization {
        id
		name
    }
    `;

const DeleteOrganizationModalAccountFragment = graphql`
fragment DeleteOrganizationModalAccountFragment on Account {
	id
}
`;

const DeleteOrganizationMutation = graphql`
  mutation DeleteOrganizationModalMutation($organizationId: ID!) {
    deleteOrganization(organizationId: $organizationId) {
        __typename
        ... on Organization {
            id
        }
        ... on OrganizationNotFoundError {
            __typename
        }

        ... on OrganizationAuthorizationError {
            __typename
        }
    }
  }
`;

const formSchema = z.object({
	name: z.string().check(z.minLength(1, "This field is required")),
});

export default function DeleteOrganizationModal({
	isOpen,
	onOpenChange,
	onClose,
	organization,
	account,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	organization: DeleteOrganizationModalFragment$key;
	account: DeleteOrganizationModalAccountFragment$key;
}) {
	const router = useRouter();
	const data = useFragment(DeleteOrganizationModalFragment, organization);
	const accountData = useFragment(
		DeleteOrganizationModalAccountFragment,
		account,
	);
	const [commitMutation, isMutationInFlight] =
		useMutation<DeleteOrganizationModalMutation>(DeleteOrganizationMutation);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (values.name !== data.name) {
			setError("name", {
				message: "Organization name does not match",
				type: "manual",
			});
			return;
		}
		commitMutation({
			variables: {
				organizationId: data.id,
			},
			updater(store) {
				const connectionID = ConnectionHandler.getConnectionID(
					accountData.id,
					"OrganizationListFragment_organizations",
				);
				const connectionRecord = store.get(connectionID);

				const organizationRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && organizationRecord) {
					ConnectionHandler.deleteNode(
						connectionRecord,
						organizationRecord.getDataID(),
					);
				}
			},
			onCompleted(response) {
				onClose();
				if (response.deleteOrganization.__typename === "Organization") {
					// handle success
					router.push(links.dashboard);
				} else if (
					response.deleteOrganization.__typename === "OrganizationNotFoundError"
				) {
					addToast({
						description: "An unexpected error occurred. Please try again.",
						color: "danger",
					});
				} else if (
					response.deleteOrganization.__typename ===
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
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
				<ModalContent className="flex flex-col w-full p-4 sm:p-6">
					<ModalHeader>
						<h2 className="text-lg font-medium">Delete Organization</h2>
					</ModalHeader>
					<form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<ModalBody className="flex flex-col gap-6">
							<p className="text-foreground-500">
								Are you sure you want to delete this organization? This action
								will delete all of its jobs and cannot be undone.
							</p>
							<p>
								Enter <span className="font-medium">{data.name}</span> to
								confirm
							</p>
							<Input
								{...register("name")}
								fullWidth
								label="Organization name"
								isInvalid={!!errors.name}
								errorMessage={errors.name?.message}
							/>
						</ModalBody>
						<ModalFooter className="w-full">
							<Button variant="light" onPress={onClose}>
								Cancel
							</Button>
							<Button
								color="danger"
								isLoading={isSubmitting || isMutationInFlight}
								type="submit"
							>
								Delete Organization
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
