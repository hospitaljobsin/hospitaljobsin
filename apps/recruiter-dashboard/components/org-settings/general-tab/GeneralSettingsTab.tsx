/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { GeneralSettingsTabFragment$key } from "@/__generated__/GeneralSettingsTabFragment.graphql";
import PageOrganizationGeneralSettingsQuery, {
	type pageOrganizationGeneralSettingsQuery,
} from "@/__generated__/pageOrganizationGeneralSettingsQuery.graphql";
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
	initialQueryRef: PreloadedQuery<pageOrganizationGeneralSettingsQuery>;
}) {
	const rootQuery = usePreloadedQuery(
		PageOrganizationGeneralSettingsQuery,
		initialQueryRef,
	);
	const data = useFragment<GeneralSettingsTabFragment$key>(
		GeneralSettingsTabFragment,
		rootQuery,
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

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
