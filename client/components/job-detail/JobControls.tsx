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
  mutation JobControlsSaveMutation($jobId: ID!, $connections: [ID!]!) {
    saveJob(jobId: $jobId) {
    ... on SaveJobResult  {
        savedJobEdge @prependEdge(connections: $connections) {
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
  mutation JobControlsUnsaveMutation($jobId: ID!, $connections: [ID!]!) {
    unsaveJob(jobId: $jobId) {
    ... on UnsaveJobResult {
        savedJobEdge {
            node {
            id @deleteEdge(connections: $connections)
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
}: {
	job: JobControlsFragment$key;
}) {
	const connectionId = ConnectionHandler.getConnectionID(
		"client:root",
		"SavedJobsListFragment_savedJobs",
	);
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
				connections: [connectionId],
			},
		});
	}

	function handleUnsave() {
		commitUnsaveMutation({
			variables: {
				jobId: data.id,
				connections: [connectionId],
			},
		});
	}

	return (
		<div className="flex items-center gap-8">
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
			<Button size="lg">Apply now</Button>
		</div>
	);
}
