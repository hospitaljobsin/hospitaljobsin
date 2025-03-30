import type { JobFragment$key } from "@/__generated__/JobFragment.graphql";
import { Card, CardBody } from "@heroui/react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const JobFragment = graphql`
  fragment JobFragment on JobEdge {
    node {
        title
		createdAt
		updatedAt
		expiresAt
		slug
    }
  }
`;


type Props = {
	job: JobFragment$key;
};

export default function Job({ job }: Props) {
	const data = useFragment(JobFragment, job);

	return (
		<Card fullWidth className="p-4 sm:p-6" isPressable={false} shadow="none">
			<CardBody className="flex items-center gap-6 w-full flex-row">
				<h2>{data.node.title}</h2>
			</CardBody>
		</Card>
	);
}
