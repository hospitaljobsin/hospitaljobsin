import { env } from "@/lib/env";
import links from "@/lib/links";
import { Button, Link, Tooltip } from "@heroui/react";
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";
import {
	ConnectionHandler,
	graphql,
	useFragment,
	useMutation,
} from "react-relay";
import ShareJob from "./ShareJob";
import type { JobControlsAuthFragment$key } from "./__generated__/JobControlsAuthFragment.graphql";
import type { JobControlsFragment$key } from "./__generated__/JobControlsFragment.graphql";

export const JobControlsAuthFragment = graphql`
  fragment JobControlsAuthFragment on ViewerPayload {
		__typename
  }
`;

export const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isSaved
	...ShareJobFragment
  }
`;

const JobControlsSaveMutation = graphql`
  mutation JobControlsSaveMutation($jobId: ID!) {
    saveJob(jobId: $jobId) {
    ... on SaveJobResult  {
        savedJobEdge {
            node {
                id
                ...JobDetailsInternalFragment
                ...JobControlsFragment
                }
            }       
        }
    }
  }
`;

const JobControlsUnsaveMutation = graphql`
  mutation JobControlsUnsaveMutation($jobId: ID!) {
    unsaveJob(jobId: $jobId) {
    ... on UnsaveJobResult {
        savedJobEdge {
            node {
            id
            ...JobDetailsInternalFragment
            ...JobControlsFragment
        }
        }
    }
    }
  }
`;

export default function JobControls({
	job,
	authQueryRef: rootQuery,
}: {
	job: JobControlsFragment$key;
	authQueryRef: JobControlsAuthFragment$key;
}) {
	const data = useFragment(JobControlsFragment, job);
	const authData = useFragment(JobControlsAuthFragment, rootQuery);

	const isAuthenticated = authData.__typename === "Account";
	const [commitSaveMutation, isSaveMutationInFlight] = useMutation(
		JobControlsSaveMutation,
	);
	const [commitUnsaveMutation, isUnsaveMutationInFlight] = useMutation(
		JobControlsUnsaveMutation,
	);

	function handleSave() {
		commitSaveMutation({
			variables: {
				jobId: data.id,
			},
			updater: (store) => {
				// Retrieve the connection from the store
				const rootRecord = store.getRoot();
				const connectionRecord = ConnectionHandler.getConnection(
					rootRecord,
					"SavedJobListFragment_savedJobs",
				);

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && jobRecord) {
					const newEdge = ConnectionHandler.createEdge(
						store,
						connectionRecord,
						jobRecord,
						"SavedJobsListEdge",
					);
					ConnectionHandler.insertEdgeBefore(connectionRecord, newEdge);
				}
			},
		});
	}

	function handleUnsave() {
		commitUnsaveMutation({
			variables: {
				jobId: data.id,
			},
			updater: (store) => {
				// Retrieve the connection from the store
				const rootRecord = store.getRoot();
				const connectionRecord = ConnectionHandler.getConnection(
					rootRecord,
					"SavedJobListFragment_savedJobs",
				);

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connectionRecord && jobRecord) {
					ConnectionHandler.deleteNode(connectionRecord, jobRecord.getDataID());
				}
			},
		});
	}

	return (
		<div className="flex items-center gap-4">
			{!isAuthenticated ? (
				<Tooltip
					showArrow
					content={
						<div className="px-1 py-2">
							<div className="text-sm">
								<Link
									href={links.login(env.NEXT_PUBLIC_URL)}
									isExternal
									size="sm"
								>
									Sign in
								</Link>{" "}
								to save this job
							</div>
						</div>
					}
				>
					<span>
						<Button size="lg" isIconOnly variant="light" isDisabled>
							<BookmarkIcon
								size={24}
								strokeWidth={1.5}
								className="text-foreground-500"
							/>
						</Button>
					</span>
				</Tooltip>
			) : (
				<>
					{data.isSaved ? (
						<Tooltip content="Unsave job">
							<Button
								size="lg"
								variant="light"
								isIconOnly
								onPress={handleUnsave}
								isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
							>
								<BookmarkCheckIcon
									size={24}
									strokeWidth={1.5}
									className="text-foreground-500"
								/>
							</Button>
						</Tooltip>
					) : (
						<Tooltip content="Save job">
							<Button
								size="lg"
								variant="light"
								isIconOnly
								onPress={handleSave}
								isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
							>
								<BookmarkIcon
									size={24}
									strokeWidth={1.5}
									className="text-foreground-500"
								/>
							</Button>
						</Tooltip>
					)}
				</>
			)}
			<ShareJob job={data} />
		</div>
	);
}
