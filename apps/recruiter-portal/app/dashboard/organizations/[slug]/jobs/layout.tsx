"use client";
import type { layoutJobRootQuery } from "@/__generated__/layoutJobRootQuery.graphql";
import JobDetailHeader from "@/components/layout/JobDetailHeader";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const JobRootLayoutQuery = graphql`
	query layoutJobRootQuery($slug: String!, $jobSlug: String!) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				job(slug: $jobSlug) {
					__typename
					... on Job {
						...JobDetailHeaderJobFragment
					}
				}
			}
		}

	}
`;

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);
	const data = useLazyLoadQuery<layoutJobRootQuery>(
		JobRootLayoutQuery,
		{
			slug: slug,
			jobSlug: jobSlug,
		},
		{ fetchPolicy: "store-or-network" },
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' type.",
	);
	invariant(data.organization.job.__typename === "Job", "Expected 'Job' type.");

	return (
		<>
			<JobDetailHeader job={data.organization.job} />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
