/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { JobSettingsGeneralTabFragment$key } from "@/__generated__/JobSettingsGeneralTabFragment.graphql";
import { useCheckSudoMode } from "@/lib/hooks/useCheckSudoMode";
import { Button, Card, CardBody, Divider, useDisclosure } from "@heroui/react";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import DeleteJobModal from "./DeleteJobModal";
import JobEditForm from "./JobEditForm";

const JobSettingsGeneralTabFragment = graphql`
 fragment JobSettingsGeneralTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
		organization(slug: $slug) {
		__typename
		... on Organization {
			job(slug: $jobSlug) {
				__typename
				... on Job {
					...JobEditFormFragment
					...DeleteJobModalFragment
				}
			}
		}
		}

        viewer {
            __typename
            ... on Account {
                sudoModeExpiresAt
            }
        }
  }
`;

export default function JobSettingsGeneralTab(props: {
	rootQuery: JobSettingsGeneralTabFragment$key;
}) {
	const query = useFragment(JobSettingsGeneralTabFragment, props.rootQuery);
	invariant(
		query.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	invariant(
		query.organization.job.__typename === "Job",
		"Expected 'Job' node type",
	);
	invariant(
		query.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	const { checkSudoMode } = useCheckSudoMode();

	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

	function handleDeleteModalOpen() {
		if (checkSudoMode(query.viewer.sudoModeExpiresAt)) {
			onOpen();
		}
	}

	return (
		<>
			<div className="w-full h-full flex flex-col gap-12">
				<JobEditForm rootQuery={query.organization.job} />
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
										Delete Job
									</h4>
									<p className="text-sm text-foreground-500">
										Once you delete a job, there is no going back. Please be
										certain.
									</p>
								</div>
								<Button
									color="danger"
									variant="faded"
									className="w-full sm:w-auto"
									onPress={handleDeleteModalOpen}
								>
									Delete job
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
			<DeleteJobModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				job={query.organization.job}
			/>
		</>
	);
}
