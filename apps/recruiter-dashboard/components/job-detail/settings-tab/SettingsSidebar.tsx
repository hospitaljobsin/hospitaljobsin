"use client";

import type { SettingsSidebarJobSettingsQuery as SettingsSidebarJobSettingsQueryType } from "@/__generated__/SettingsSidebarJobSettingsQuery.graphql";
import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { FileText, Settings } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";

export const SettingsSidebarJobSettingsQuery = graphql`
	query SettingsSidebarJobSettingsQuery($slug: String!, $jobSlug: String!) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isAdmin
				job(slug: $jobSlug) {
					__typename
					... on Job {
						externalApplicationUrl
					}
				}
			}
		}
	}
`;

export default function SettingsSidebar({
	queryReference,
}: { queryReference: PreloadedQuery<SettingsSidebarJobSettingsQueryType> }) {
	const pathname = usePathname();
	const params = useParams<{ slug: string }>();
	const data = usePreloadedQuery(
		SettingsSidebarJobSettingsQuery,
		queryReference,
	);

	if (
		data.organization.__typename !== "Organization" ||
		!data.organization.isAdmin ||
		data.organization.job.__typename !== "Job"
	) {
		return null;
	}

	return (
		<>
			<div className="w-64 p-4 justify-start hidden md:flex md:sticky top-0 self-stretch max-h-screen">
				<Tabs
					aria-label="Job Settings Navigation"
					isVertical
					variant="light"
					selectedKey={pathname}
					classNames={{
						tabWrapper: "w-full",
						base: "w-full",
						tabContent: "w-full",
						tabList: "w-full",
						panel: "h-full",
						tab: "py-5",
						cursor: "shadow-none",
					}}
				>
					<Tab
						key={links.jobDetailSettings(params.slug)}
						href={links.jobDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={20} />
								<span>General</span>
							</div>
						}
					/>
					{data.organization.job.externalApplicationUrl === null && (
						<Tab
							key={links.jobDetailSettingsApplicationForm(params.slug)}
							href={links.jobDetailSettingsApplicationForm(params.slug)}
							title={
								<div className="flex items-center space-x-4">
									<FileText size={20} />
									<span>Screening Questions</span>
								</div>
							}
						/>
					)}
				</Tabs>
			</div>
			<div className="w-full md:hidden p-4 flex justify-start">
				<Tabs
					aria-label="Job Settings Navigation"
					variant="light"
					selectedKey={pathname}
					classNames={{
						base: "w-full overflow-x-auto",
						tabList: "gap-4",
						cursor: "shadow-none",
					}}
				>
					<Tab
						key={links.jobDetailSettings(params.slug)}
						href={links.jobDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<Settings size={16} />
								<span>General</span>
							</div>
						}
					/>
					<Tab
						key={links.jobDetailSettingsApplicationForm(params.slug)}
						href={links.jobDetailSettingsApplicationForm(params.slug)}
						title={
							<div className="flex items-center space-x-4">
								<FileText size={16} />
								<span>Screening Questions</span>
							</div>
						}
					/>
				</Tabs>
			</div>
		</>
	);
}
