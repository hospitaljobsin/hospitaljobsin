"use client";
import type { JobTabsFragment$key } from "@/__generated__/JobTabsFragment.graphql";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Tab, Tabs } from "@heroui/react";
import { ChartNoAxesCombinedIcon, SquarePenIcon, Users } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const JobTabsFragment = graphql`
fragment JobTabsFragment on Job {
	externalApplicationUrl
	organization @required(action: THROW) {
		isAdmin
	}
}`;

export default function JobTabs({ job }: { job: JobTabsFragment$key }) {
	const pathname = usePathname();
	const params = useParams<{
		slug: string;
		applicantSlug?: string;
	}>();
	const data = useFragment(JobTabsFragment, job);

	const router = useRouter();

	function getSelectedKey(pathname: string) {
		if (pathname === links.jobDetailSettingsApplicationForm(params.slug)) {
			return links.jobDetailSettings(params.slug);
		}

		if (
			params.applicantSlug &&
			pathname === links.applicantDetail(params.slug, params.applicantSlug)
		) {
			return links.jobDetailApplicants(params.slug);
		}
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
				onSelectionChange={(key) => {
					if (typeof key === "string") {
						router.push(key);
					}
				}}
			>
				{" "}
				{data.externalApplicationUrl === null && (
					<Tab
						key={links.jobDetailApplicants(params.slug)}
						title={
							<div className="flex items-center space-x-2">
								<Users />
								<span>Applicants</span>
							</div>
						}
					/>
				)}
				<Tab
					key={links.jobDetailAnalytics(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<ChartNoAxesCombinedIcon />
							<span>Analytics</span>
						</div>
					}
				/>
				{data.organization.isAdmin && (
					<Tab
						key={links.jobDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-2">
								<SquarePenIcon />
								<span>Edit Job</span>
							</div>
						}
					/>
				)}
			</Tabs>
		</div>
	);
}
