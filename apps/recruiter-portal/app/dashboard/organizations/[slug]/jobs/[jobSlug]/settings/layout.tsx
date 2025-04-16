"use client";
import type { layoutJobSettingsQuery } from "@/__generated__/layoutJobSettingsQuery.graphql";
import SettingsSidebar from "@/components/job-detail/settings-tab/Sidebar";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const JobSettingsLayoutQuery = graphql`
	query layoutJobSettingsQuery($slug: String!, $jobSlug: String!) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				job(slug: $jobSlug) {
					__typename
					... on Job {
						...SidebarJobSettingsFragment
					}
				}
			}
		}
	}
`;

export default function JobSettingsLayout({
	children,
}: { children: React.ReactNode }) {
	const params = useParams<{ slug: string; jobSlug: string }>();
	const slug = decodeURIComponent(params.slug);
	const jobSlug = decodeURIComponent(params.jobSlug);

	const data = useLazyLoadQuery<layoutJobSettingsQuery>(
		JobSettingsLayoutQuery,
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
			<div className="relative w-full h-full">
				<div className="absolute top-0 left-0 w-1/2 h-full bg-background-700" />
				<div className="absolute top-0 right-0 w-1/2 h-full bg-background-600" />
				<div className="relative w-full mx-auto max-w-5xl">
					<div className="flex flex-col md:flex-row min-h-screen bg-background-600">
						{/* Sidebar will now grow to fill the height */}
						<SettingsSidebar job={data.organization.job} />
						<div className="flex-1 px-4 py-6 md:pl-12 bg-background-600">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
