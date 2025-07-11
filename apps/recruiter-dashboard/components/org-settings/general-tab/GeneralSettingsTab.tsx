/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { GeneralSettingsTabFragment$key } from "@/__generated__/GeneralSettingsTabFragment.graphql";
import OrganizationGeneralSettingsClientComponentQuery, {
	type OrganizationGeneralSettingsClientComponentQuery as OrganizationGeneralSettingsClientComponentQueryType,
} from "@/__generated__/OrganizationGeneralSettingsClientComponentQuery.graphql";
import NotFoundView from "@/components/NotFoundView";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { Button, Card, CardBody, Divider, useDisclosure } from "@heroui/react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import DeleteOrganizationModal from "./DeleteOrganizationModal";
import UpdateOrganizationForm from "./UpdateOrganizationForm";

const GeneralSettingsTabFragment = graphql`
 fragment GeneralSettingsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
				isAdmin
                ...UpdateOrganizationFormFragment
				...DeleteOrganizationModalFragment
            }
        }

		viewer {
			__typename
			... on Account {
				sudoModeExpiresAt
				...DeleteOrganizationModalAccountFragment
			}
		}

  }
`;

export default function GeneralSettingsTab({
	initialQueryRef,
}: {
	initialQueryRef: PreloadedQuery<OrganizationGeneralSettingsClientComponentQueryType>;
}) {
	const rootQuery = usePreloadedQuery(
		OrganizationGeneralSettingsClientComponentQuery,
		initialQueryRef,
	);
	const data = useFragment<GeneralSettingsTabFragment$key>(
		GeneralSettingsTabFragment,
		rootQuery,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin
	) {
		return <NotFoundView />;
	}

	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	const { checkSudoMode } = useCheckSudoMode();

	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

	function handleDeleteModalOpen() {
		if (checkSudoMode(data.viewer.sudoModeExpiresAt)) {
			onOpen();
		}
	}
	return (
		<>
			<div className="w-full h-full flex flex-col items-center gap-12">
				<UpdateOrganizationForm rootQuery={data.organization} />
				<Divider />
				<div className="flex flex-col gap-6 w-full">
					<h2 className="font-medium text-foreground-400">Danger Zone</h2>
					<Card
						className="p-6"
						fullWidth
						shadow="none"
						classNames={{ base: "outline-danger-100" }}
					>
						<CardBody className="w-full flex flex-col gap-6">
							<div className="flex w-full gap-6 items-center justify-between flex-col sm:flex-row">
								<div className="flex flex-col gap-2">
									<h4 className="font-medium text-foreground-700">
										Delete Organization
									</h4>
									<p className="text-sm text-foreground-500 w-full text-pretty">
										Once you delete an organization, it will be gone forever.
										Please be certain.
									</p>
								</div>
								<Button
									color="danger"
									variant="faded"
									className="w-full sm:w-auto"
									onPress={handleDeleteModalOpen}
								>
									Delete organization
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
			<DeleteOrganizationModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				organization={data.organization}
				account={data.viewer}
			/>
		</>
	);
}
