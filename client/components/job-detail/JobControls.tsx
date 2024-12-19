import { Button } from "@nextui-org/react";
import { BookmarkIcon } from "lucide-react";
import {
	ConnectionHandler,
	graphql,
	useFragment,
	useMutation,
} from "react-relay";
import type { JobControlsFragment$key } from "./__generated__/JobControlsFragment.graphql";

const JobControlsFragment = graphql`
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
	const connectionId = ConnectionHandler.getConnectionID(
		"client:root",
		"SavedJobsListFragment_savedJobs",
		[],
	);

	console.log("connection ID: ", connectionId);
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
				const connection = ConnectionHandler.getConnection(
					rootRecord,
					"SavedJobsListFragment_savedJobs",
				);

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connection && jobRecord) {
					const newEdge = ConnectionHandler.createEdge(
						store,
						connection,
						jobRecord,
						"SavedJobsListEdge",
					);
					ConnectionHandler.insertEdgeBefore(connection, newEdge);
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
				const connection = ConnectionHandler.getConnection(
					rootRecord,
					"SavedJobsListFragment_savedJobs",
				);

				const jobRecord = store.get(data.id);

				// Only update if the connection exists
				if (connection && jobRecord) {
					ConnectionHandler.deleteNode(connection, jobRecord.getDataID());
				}
			},
		});
	}

	return (
		<div className="flex items-center gap-8">
			{!isAuthenticated ? (
				<span>
					<Button size="lg" variant="bordered" isDisabled>
						Login to Save
					</Button>
				</span>
			) : (
				<>
					{data.isSaved ? (
						<Button
							size="lg"
							variant="bordered"
							startContent={<BookmarkIcon size={18} />}
							onPress={handleUnsave}
							isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
						>
							Saved
						</Button>
					) : (
						<Button
							size="lg"
							variant="bordered"
							onPress={handleSave}
							isDisabled={isSaveMutationInFlight || isUnsaveMutationInFlight}
						>
							Save
						</Button>
					)}
				</>
			)}

			<Button size="lg">Apply now</Button>
		</div>
	);
}
