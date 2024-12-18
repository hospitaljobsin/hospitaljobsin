import { Button } from "@nextui-org/react";
import { BookmarkIcon } from "lucide-react";
import { graphql, useFragment, useMutation } from "react-relay";
import { JobControlsConnectionFragment$key } from "./__generated__/JobControlsConnectionFragment.graphql";
import { JobControlsFragment$key } from "./__generated__/JobControlsFragment.graphql";

const JobControlsConnectionFragment = graphql`
  fragment JobControlsConnectionFragment on Query
  @argumentDefinitions(
    cursor: { type: "ID" }
    count: { type: "Int", defaultValue: 10 }
  ) {
    savedJobs(after: $cursor, first: $count)
      @connection(key: "SavedJobsListFragment_savedJobs") {
      __id
      edges {
        # we have to select the edges field while
        # using the @connection directive
        __typename
      }
    }
  }
`;

const JobControlsFragment = graphql`
  fragment JobControlsFragment on Job {
    id
    isSaved
  }
`;

const JobControlsSaveMutation = graphql`
  mutation JobControlsSaveMutation($jobId: ID!,     $connections: [ID!]!) {
    saveJob(jobId: $jobId) {
    ... on SaveJobResult  {
        savedJobEdge @prependEdge(connections: $connections) {
            node {
            id
            ...JobDetailsFragment
        }
        }
       
    }
    }
  }
`;

const JobControlsUnsaveMutation = graphql`
  mutation JobControlsUnsaveMutation($jobId: ID!,     $connections: [ID!]!) {
    unsaveJob(jobId: $jobId) {
    ... on UnsaveJobResult {
        savedJobEdge @deleteEdge(connections: $connections) {
            node {
            id
            ...JobDetailsFragment
        }
        }
    }
    }
  }
`;

export default function JobControls({
	rootQuery,
	job,
}: {
	rootQuery: JobControlsConnectionFragment$key;
	job: JobControlsFragment$key;
}) {
	const connectionData = useFragment(JobControlsConnectionFragment, rootQuery);
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
				connections: [connectionData.savedJobs.__id],
			},
		});
	}

	function handleUnsave() {
		commitUnsaveMutation({
			variables: {
				jobId: data.id,
				connections: [connectionData.savedJobs.__id],
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
