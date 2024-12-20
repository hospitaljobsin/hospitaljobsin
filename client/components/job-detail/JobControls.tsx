import { Button } from "@nextui-org/react";
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";
import {
	ConnectionHandler,
	graphql,
	useFragment,
	useMutation,
} from "react-relay";
import type { JobControlsFragment$key } from "./__generated__/JobControlsFragment.graphql";

export const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isSaved
  }
`;

const JobControlsSaveMutation = graphql`
  mutation JobControlsSaveMutation($jobId: ID!) {
    saveJob(jobId: $jobId) {
    ... on SaveJobResult  {
        savedJobEdge {
            node {
                id
                ...JobDetailsFragment
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
            ...JobDetailsFragment
            ...JobControlsFragment
        }
        }
    }
    }
  }
`;

export default function JobControls({
	job,
	isAuthenticated,
}: {
	isAuthenticated: boolean;
	job: JobControlsFragment$key;
}) {
	const data = useFragment(JobControlsFragment, job);
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
					"SavedJobsListFragment_savedJobs",
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
					"SavedJobsListFragment_savedJobs",
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
		<>
			{!isAuthenticated ? (
				<span>
					<Button size="lg" isIconOnly variant="light" isDisabled>
						<BookmarkIcon
							size={32}
							strokeWidth={1.5}
							className="text-foreground-500"
						/>
					</Button>
				</span>
			) : (
				<>
					{data.isSaved ? (
						<Button
							size="lg"
							variant="light"
							isIconOnly
							onPress={handleUnsave}
							isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
						>
							<BookmarkCheckIcon
								size={32}
								strokeWidth={1.5}
								className="text-foreground-500"
							/>
						</Button>
					) : (
						<Button
							size="lg"
							variant="light"
							isIconOnly
							onPress={handleSave}
							isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
						>
							<BookmarkIcon
								size={32}
								strokeWidth={1.5}
								className="text-foreground-500"
							/>
						</Button>
					)}
				</>
			)}
		</>
	);
}
