"use client";
import JobDetailHeader from "@/components/layout/JobDetailHeader";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const JobRootLayoutQuery = graphql`
	query layoutJobRootQuery($slug: String!) {
		job(slug: $slug) {
			__typename
			... on Job {
				...JobDetailHeaderJobFragment
			}
		}
	}
`;

export default function JobRootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const slug = useParams<{ jobSlug: string }>().jobSlug;
	const data = useLazyLoadQuery<layoutJobRootQuery>(
		JobRootLayoutQuery,
		{
			slug: slug,
		},
		{ fetchPolicy: "store-or-network" },
	);
	invariant(data.job.__typename === "Job", "Expected 'Job' type.");

	return (
		<>
			<JobDetailHeader job={data.job} />
			<div className="w-full mx-auto bg-background-600">{children}</div>
		</>
	);
}
