"use client";
import type { NewJobViewQuery as NewJobViewQueryType } from "@/__generated__/NewJobViewQuery.graphql";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import NewJobForm from "./NewJobForm";

const NewJobViewQuery = graphql`
 query NewJobViewQuery($slug: String!) {
        viewer {
            __typename
            ... on Account {
                ...NewJobFormAccountFragment
            }
        }

        organization(slug: $slug) {
            __typename
            ... on Organization {
                ...NewJobFormOrganizationFragment
            }
        }
  }
`;

export default function NewJobView() {
	const params = useParams<{ slug: string }>();
	const data = useLazyLoadQuery<NewJobViewQueryType>(NewJobViewQuery, {
		slug: params.slug,
	});

	invariant(
		data.viewer.__typename === "Account",
		"Expected viewer to be an Account",
	);

	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);

	return (
		<div className="flex flex-col w-full h-full">
			<NewJobForm account={data.viewer} organization={data.organization} />
		</div>
	);
}
