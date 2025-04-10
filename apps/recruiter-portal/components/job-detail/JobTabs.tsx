"use client";
import type { JobTabsFragment$key } from "@/__generated__/JobTabsFragment.graphql";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { Edit, FileText, HomeIcon, Users } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";

const JobTabsFragment = graphql`
fragment JobTabsFragment on Job {
  organization {
    isAdmin
  }
}`;

export default function JobTabs({ job }: { job: JobTabsFragment$key }) {
	const pathname = usePathname();
	const params = useParams<{ slug: string; jobSlug: string }>();
	const data = useFragment(JobTabsFragment, job);

	const organization = data.organization;
	invariant(organization, "Expected 'Organization' node type");

	function getSelectedKey(pathname: string) {
		// if (pathname === links.organizationCreateJob(params.slug)) {
		// 	return links.organizationDetailJobs(params.slug);
		// }
		// if (pathname === links.organizationDetailMemberInvites(params.slug)) {
		// 	return links.organizationDetailMembers(params.slug);
		// }
		return pathname;
	}

	return (
		<div className="flex w-full flex-col">
			<Tabs
				aria-label="Organization Detail Menu"
				color="default"
				variant="underlined"
				classNames={{
					tabList: "py-0",
					tab: "py-6",
				}}
				selectedKey={getSelectedKey(pathname)}
			>
				<Tab
					key={links.organizationJobDetail(params.slug, params.jobSlug)}
					href={links.organizationJobDetail(params.slug, params.jobSlug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailJobs(params.slug)}
					href={links.organizationDetailJobs(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<Users />
							<span>Applicants</span>
						</div>
					}
				/>
				{organization.isAdmin && (
					<>
						<Tab
							key={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
							href={links.jobDetailApplicationForm(params.slug, params.jobSlug)}
							title={
								<div className="flex items-center space-x-2">
									<FileText />
									<span>Application Form</span>
								</div>
							}
						/>
						<Tab
							key={links.jobDetailEdit(params.slug, params.jobSlug)}
							href={links.jobDetailEdit(params.slug, params.jobSlug)}
							title={
								<div className="flex items-center space-x-2">
									<Edit />
									<span>Edit Job</span>
								</div>
							}
						/>
					</>
				)}
			</Tabs>
		</div>
	);
}
